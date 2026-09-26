'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { ScreeningDashboard } from '@/components/screening/ScreeningDashboard';
import { PatientEvidenceDrawer } from '@/components/screening/PatientEvidenceDrawer';
import { ProtocolStudio } from '@/components/protocol/ProtocolStudio';
import { OutreachManager } from '@/components/outreach/OutreachManager';
import { EHRIntegrationHub } from '@/components/ehr/EHRIntegrationHub';
import { OpenApiPlayground } from '@/components/api/OpenApiPlayground';
import { SAMPLE_PROTOCOLS } from '@/lib/data/sampleProtocols';
import { SAMPLE_PATIENTS } from '@/lib/data/samplePatients';
import { evaluatePatientForTrial } from '@/lib/engine/criteriaEngine';
import { TrialProtocol, PatientTrialEvaluation, EvaluationStatus } from '@/types/protocol';
import { FHIRPatientRecord } from '@/types/fhir';
import { Activity, ShieldCheck, Database, HeartPulse } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'screening' | 'protocols' | 'outreach' | 'ehr' | 'api'>('screening');
  const [protocols, setProtocols] = useState<TrialProtocol[]>(SAMPLE_PROTOCOLS);
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(SAMPLE_PROTOCOLS[0].id);
  const [patientRecords, setPatientRecords] = useState<FHIRPatientRecord[]>(SAMPLE_PATIENTS);
  const [userRole, setUserRole] = useState<'INVESTIGATOR' | 'COORDINATOR'>('INVESTIGATOR');
  const [selectedPatientForEvidence, setSelectedPatientForEvidence] = useState<string | null>(null);
  const [outreachTargetPatientId, setOutreachTargetPatientId] = useState<string>('p-001');

  // Currently selected protocol
  const selectedProtocol = useMemo(() => {
    return protocols.find(p => p.id === selectedProtocolId) || protocols[0];
  }, [protocols, selectedProtocolId]);

  // Initial evaluations for current protocol
  const [evaluationsMap, setEvaluationsMap] = useState<Record<string, PatientTrialEvaluation[]>>(() => {
    const initialMap: Record<string, PatientTrialEvaluation[]> = {};
    for (const proto of SAMPLE_PROTOCOLS) {
      initialMap[proto.id] = SAMPLE_PATIENTS.map(patient => 
        evaluatePatientForTrial(patient, proto)
      );
    }
    return initialMap;
  });

  const currentEvaluations = useMemo(() => {
    return evaluationsMap[selectedProtocol.id] || [];
  }, [evaluationsMap, selectedProtocol.id]);

  // Refresh evaluations
  const handleRefreshEvaluations = () => {
    const updated = patientRecords.map(patient => 
      evaluatePatientForTrial(patient, selectedProtocol)
    );
    setEvaluationsMap(prev => ({
      ...prev,
      [selectedProtocol.id]: updated
    }));
  };

  // Clinician Override Handler
  const handleOverrideCriterion = (
    patientId: string,
    criterionId: string,
    newStatus: EvaluationStatus,
    reason: string
  ) => {
    setEvaluationsMap(prev => {
      const protoId = selectedProtocol.id;
      const currentList = prev[protoId] || [];

      const updatedList = currentList.map(ev => {
        if (ev.patientId !== patientId) return ev;

        const updatedCriteria = ev.criteriaResults.map(crit => {
          if (crit.criterionId !== criterionId) return crit;

          return {
            ...crit,
            status: newStatus,
            clinicianOverride: {
              overriddenStatus: newStatus,
              clinicianName: userRole === 'INVESTIGATOR' ? 'Dr. Aris Thorne, MD (PI)' : 'Sarah Lin, RN (Coordinator)',
              clinicianRole: userRole === 'INVESTIGATOR' ? 'Principal Investigator' : 'Clinical Research Coordinator',
              overrideReason: reason,
              overriddenAt: new Date().toISOString()
            }
          };
        });

        // Recalculate blockers and overall status
        const inclusions = updatedCriteria.filter(c => c.criterionType === 'INCLUSION');
        const exclusions = updatedCriteria.filter(c => c.criterionType === 'EXCLUSION');

        const inclusionMetCount = inclusions.filter(r => r.status === 'PASS').length;
        const exclusionTriggeredCount = exclusions.filter(r => r.status === 'FAIL').length;
        const inconclusiveCount = updatedCriteria.filter(r => r.status === 'INCONCLUSIVE' || r.status === 'MANUAL_REVIEW').length;

        const blockerReasons: string[] = [];
        for (const inc of inclusions) {
          if (inc.status === 'FAIL') {
            blockerReasons.push(`Failed Inclusion: ${inc.criterionName} - ${inc.reasoning}`);
          }
        }
        for (const exc of exclusions) {
          if (exc.status === 'FAIL') {
            blockerReasons.push(`Exclusion Triggered: ${exc.criterionName} - ${exc.reasoning}`);
          }
        }

        let overallStatus: 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW' = 'ELIGIBLE';
        if (blockerReasons.length > 0) {
          overallStatus = 'INELIGIBLE';
        } else if (inconclusiveCount > 0) {
          overallStatus = 'NEEDS_REVIEW';
        } else if (inclusionMetCount === inclusions.length && exclusionTriggeredCount === 0) {
          overallStatus = 'ELIGIBLE';
        } else {
          overallStatus = 'NEEDS_REVIEW';
        }

        return {
          ...ev,
          overallStatus,
          inclusionMetCount,
          exclusionMetCount: exclusionTriggeredCount,
          criteriaResults: updatedCriteria,
          blockerReasons,
          matchScore: overallStatus === 'ELIGIBLE' ? 100 : Math.round((inclusionMetCount / inclusions.length) * 100),
          reviewStatus: (overallStatus === 'ELIGIBLE' ? 'CLEARED' : 'PENDING') as 'PENDING' | 'CLEARED' | 'REJECTED'
        };
      });

      return {
        ...prev,
        [protoId]: updatedList
      };
    });
  };

  // Update Protocol Handler (from Protocol Studio)
  const handleUpdateProtocol = (updated: TrialProtocol) => {
    setProtocols(prev => prev.map(p => p.id === updated.id ? updated : p));
    // Re-evaluate patients for this updated protocol
    const newEvals = patientRecords.map(patient => 
      evaluatePatientForTrial(patient, updated)
    );
    setEvaluationsMap(prev => ({
      ...prev,
      [updated.id]: newEvals
    }));
  };

  // Initiate Outreach Handler
  const handleInitiateOutreach = (patientId: string) => {
    setOutreachTargetPatientId(patientId);
    setSelectedPatientForEvidence(null);
    setActiveTab('outreach');
  };

  // Active evaluation for evidence drawer
  const activeDrawerEvaluation = useMemo(() => {
    if (!selectedPatientForEvidence) return null;
    return currentEvaluations.find(e => e.patientId === selectedPatientForEvidence) || null;
  }, [selectedPatientForEvidence, currentEvaluations]);

  const activeDrawerPatientRecord = useMemo(() => {
    if (!selectedPatientForEvidence) return null;
    return patientRecords.find(p => p.patient.id === selectedPatientForEvidence) || null;
  }, [selectedPatientForEvidence, patientRecords]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        protocols={protocols}
        selectedProtocolId={selectedProtocolId}
        setSelectedProtocolId={setSelectedProtocolId}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 space-y-6">
        {activeTab === 'screening' && (
          <ScreeningDashboard
            protocol={selectedProtocol}
            evaluations={currentEvaluations}
            patientRecords={patientRecords}
            onSelectPatientForEvidence={(id) => setSelectedPatientForEvidence(id)}
            onInitiateOutreach={handleInitiateOutreach}
            onRefreshEvaluation={handleRefreshEvaluations}
          />
        )}

        {activeTab === 'protocols' && (
          <ProtocolStudio
            protocol={selectedProtocol}
            onUpdateProtocol={handleUpdateProtocol}
          />
        )}

        {activeTab === 'outreach' && (
          <OutreachManager
            protocol={selectedProtocol}
            evaluations={currentEvaluations}
            patientRecords={patientRecords}
            selectedPatientId={outreachTargetPatientId}
          />
        )}

        {activeTab === 'ehr' && (
          <EHRIntegrationHub
            onIngestNewPatientRecord={(record) => {
              setPatientRecords(prev => [record, ...prev]);
              handleRefreshEvaluations();
            }}
          />
        )}

        {activeTab === 'api' && (
          <OpenApiPlayground />
        )}
      </main>

      {/* Clinical Evidence Inspector Drawer */}
      <PatientEvidenceDrawer
        evaluation={activeDrawerEvaluation}
        patientRecord={activeDrawerPatientRecord}
        onClose={() => setSelectedPatientForEvidence(null)}
        onOverrideCriterion={handleOverrideCriterion}
        onInitiateOutreach={handleInitiateOutreach}
        userRole={userRole}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-cyan-500" />
            <span className="font-semibold text-slate-400">Bond Health Clinical Criteria Engine</span>
            <span>•</span>
            <span>HL7 FHIR R4 Standardized</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>HIPAA Compliant Data Handling</span>
            </span>
            <span>•</span>
            <span className="text-slate-400">AWS Aurora PostgreSQL / pgvector</span>
            <span>•</span>
            <span className="text-slate-400">ElevenLabs Conversational AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
