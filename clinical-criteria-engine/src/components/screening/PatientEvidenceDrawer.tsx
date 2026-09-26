'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Tag, 
  Send, 
  ShieldAlert, 
  Fingerprint, 
  ArrowRight,
  Sparkles,
  Stethoscope,
  Clock
} from 'lucide-react';
import { PatientTrialEvaluation, CriterionEvidence, EvaluationStatus } from '@/types/protocol';
import { FHIRPatientRecord } from '@/types/fhir';

interface PatientEvidenceDrawerProps {
  evaluation: PatientTrialEvaluation | null;
  patientRecord: FHIRPatientRecord | null;
  onClose: () => void;
  onOverrideCriterion: (patientId: string, criterionId: string, newStatus: EvaluationStatus, reason: string) => void;
  onInitiateOutreach: (patientId: string) => void;
  userRole: 'INVESTIGATOR' | 'COORDINATOR';
}

export const PatientEvidenceDrawer: React.FC<PatientEvidenceDrawerProps> = ({
  evaluation,
  patientRecord,
  onClose,
  onOverrideCriterion,
  onInitiateOutreach,
  userRole,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'inclusions' | 'exclusions' | 'fhir'>('all');
  const [selectedCriterionForOverride, setSelectedCriterionForOverride] = useState<CriterionEvidence | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideTargetStatus, setOverrideTargetStatus] = useState<EvaluationStatus>('PASS');

  if (!evaluation || !patientRecord) return null;

  const handleApplyOverride = () => {
    if (!selectedCriterionForOverride || !overrideReason.trim()) return;
    onOverrideCriterion(
      evaluation.patientId,
      selectedCriterionForOverride.criterionId,
      overrideTargetStatus,
      overrideReason
    );
    setSelectedCriterionForOverride(null);
    setOverrideReason('');
  };

  const inclusions = evaluation.criteriaResults.filter(c => c.criterionType === 'INCLUSION');
  const exclusions = evaluation.criteriaResults.filter(c => c.criterionType === 'EXCLUSION');

  const displayedCriteria = 
    activeTab === 'inclusions' ? inclusions :
    activeTab === 'exclusions' ? exclusions :
    evaluation.criteriaResults;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="relative flex h-full w-full max-w-3xl flex-col bg-slate-900 border-l border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-start justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className={`mt-1 flex h-11 w-11 items-center justify-center rounded-xl font-bold text-white shadow-md ${
              evaluation.overallStatus === 'ELIGIBLE' ? 'bg-emerald-600 shadow-emerald-600/30' :
              evaluation.overallStatus === 'INELIGIBLE' ? 'bg-rose-600 shadow-rose-600/30' :
              'bg-amber-600 shadow-amber-600/30'
            }`}>
              {evaluation.overallStatus === 'ELIGIBLE' ? <CheckCircle2 className="h-6 w-6" /> :
               evaluation.overallStatus === 'INELIGIBLE' ? <XCircle className="h-6 w-6" /> :
               <AlertTriangle className="h-6 w-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight">{evaluation.patientName}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {evaluation.mrn}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                  {patientRecord.ehrSource}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>Protocol: <strong className="text-slate-200">{evaluation.trialTitle}</strong></span>
                <span>•</span>
                <span>Evaluated: {new Date(evaluation.evaluatedAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Score & Quick Action Bar */}
        <div className="grid grid-cols-4 gap-3 bg-slate-950/40 p-4 border-b border-slate-800 text-xs">
          <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Overall Match</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-base font-bold font-mono ${
                evaluation.overallStatus === 'ELIGIBLE' ? 'text-emerald-400' :
                evaluation.overallStatus === 'INELIGIBLE' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {evaluation.overallStatus}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Inclusions Met</span>
            <span className="text-base font-bold font-mono text-slate-100 mt-1 block">
              {evaluation.inclusionMetCount} / {evaluation.inclusionTotalCount}
            </span>
          </div>

          <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Exclusions Triggered</span>
            <span className={`text-base font-bold font-mono mt-1 block ${
              evaluation.exclusionMetCount > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {evaluation.exclusionMetCount} / {evaluation.exclusionTotalCount}
            </span>
          </div>

          <div className="flex items-center justify-center">
            {evaluation.overallStatus === 'ELIGIBLE' ? (
              <button
                onClick={() => onInitiateOutreach(evaluation.patientId)}
                className="w-full h-full flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-3 py-2 text-xs shadow-md shadow-cyan-600/20 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Start Outreach</span>
              </button>
            ) : (
              <div className="text-center">
                <span className="text-[11px] text-slate-400">Review status:</span>
                <span className="block font-bold text-amber-300 font-mono text-xs">{evaluation.reviewStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Blocker Reasons Alert (If Ineligible) */}
        {evaluation.blockerReasons.length > 0 && (
          <div className="bg-rose-950/30 border-b border-rose-900/40 p-4">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold mb-1.5">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>Eligibility Blockers Identified ({evaluation.blockerReasons.length})</span>
            </div>
            <ul className="space-y-1 pl-6 list-disc text-xs text-rose-200/90">
              {evaluation.blockerReasons.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 text-xs bg-slate-900">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 font-medium border-b-2 transition ${
              activeTab === 'all' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            All Evidence ({evaluation.criteriaResults.length})
          </button>
          <button
            onClick={() => setActiveTab('inclusions')}
            className={`pb-2.5 font-medium border-b-2 transition ${
              activeTab === 'inclusions' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inclusions ({inclusions.length})
          </button>
          <button
            onClick={() => setActiveTab('exclusions')}
            className={`pb-2.5 font-medium border-b-2 transition ${
              activeTab === 'exclusions' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Exclusions ({exclusions.length})
          </button>
          <button
            onClick={() => setActiveTab('fhir')}
            className={`pb-2.5 font-medium border-b-2 transition ${
              activeTab === 'fhir' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw FHIR Bundle
          </button>
        </div>

        {/* Drawer Body / Evidence List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'fhir' ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="flex justify-between items-center mb-3 text-slate-400 border-b border-slate-800 pb-2">
                <span>FHIR R4 Patient Resource Bundle</span>
                <span className="text-[10px] text-cyan-400">JSON Format</span>
              </div>
              <pre className="text-[11px] text-emerald-400/90 leading-relaxed">
                {JSON.stringify(patientRecord, null, 2)}
              </pre>
            </div>
          ) : (
            displayedCriteria.map((crit) => {
              const isPassed = crit.status === 'PASS';
              const isFailed = crit.status === 'FAIL';
              const isOverridden = !!crit.clinicianOverride;

              return (
                <div
                  key={crit.criterionId}
                  className={`rounded-xl border p-4 transition ${
                    isOverridden
                      ? 'bg-purple-950/20 border-purple-800/40'
                      : isPassed
                      ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      : isFailed
                      ? 'bg-rose-950/20 border-rose-900/40'
                      : 'bg-amber-950/20 border-amber-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isPassed ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                        ) : isFailed ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-950 text-rose-400 border border-rose-700/60">
                            <XCircle className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-950 text-amber-400 border border-amber-700/60">
                            <HelpCircle className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{crit.criterionName}</h4>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase font-bold ${
                            crit.criterionType === 'INCLUSION' ? 'bg-sky-950 text-sky-400 border border-sky-800/40' : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                          }`}>
                            {crit.criterionType}
                          </span>
                          {isOverridden && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-900/80 text-purple-300 border border-purple-700 flex items-center gap-1">
                              <Stethoscope className="h-2.5 w-2.5" />
                              <span>Overridden</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{crit.reasoning}</p>
                      </div>
                    </div>

                    {/* Investigator Override Button */}
                    {userRole === 'INVESTIGATOR' && (
                      <button
                        onClick={() => {
                          setSelectedCriterionForOverride(crit);
                          setOverrideTargetStatus(crit.status === 'PASS' ? 'FAIL' : 'PASS');
                        }}
                        className="text-[11px] text-slate-400 hover:text-cyan-300 underline shrink-0 transition"
                      >
                        Override
                      </button>
                    )}
                  </div>

                  {/* Traceable Grounding Evidence Box */}
                  <div className="mt-3 rounded-lg bg-slate-900/90 border border-slate-800/90 p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Fingerprint className="h-3.5 w-3.5 text-cyan-400" />
                        <span className="font-mono text-slate-300">
                          {crit.sourceResourceType || 'Clinical Record'}
                          {crit.sourceResourceId && ` (${crit.sourceResourceId})`}
                        </span>
                      </div>
                      {crit.recordedDate && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(crit.recordedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {crit.valueObserved && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Measured / Observed:</span>
                        <span className="font-mono font-bold text-cyan-300">{crit.valueObserved}</span>
                      </div>
                    )}

                    {crit.referenceRangeText && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Normal Reference Range:</span>
                        <span className="font-mono text-slate-400">{crit.referenceRangeText}</span>
                      </div>
                    )}

                    {crit.clinicalNoteExcerpt && (
                      <div className="evidence-quote rounded p-2 text-slate-300 text-[11px] italic mt-2">
                        "{crit.clinicalNoteExcerpt}"
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>Engine Confidence: {Math.round(crit.confidenceScore * 100)}%</span>
                      {crit.sourceCode && (
                        <span className="font-mono text-slate-400">Code: {crit.sourceCode}</span>
                      )}
                    </div>

                    {/* Display Override Details If Present */}
                    {crit.clinicianOverride && (
                      <div className="mt-2 rounded bg-purple-950/40 border border-purple-800/50 p-2 text-[11px] text-purple-200">
                        <div className="flex items-center justify-between font-bold">
                          <span>Clinician Sign-off: {crit.clinicianOverride.clinicianName}</span>
                          <span className="text-[10px] opacity-80">{new Date(crit.clinicianOverride.overriddenAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="mt-1 text-slate-300">Reason: {crit.clinicianOverride.overrideReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Clinician Override Dialog */}
        {selectedCriterionForOverride && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">Clinician Eligibility Override</h3>
                </div>
                <button
                  onClick={() => setSelectedCriterionForOverride(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="text-xs text-slate-400">Criterion:</span>
                <p className="text-sm font-semibold text-slate-200">{selectedCriterionForOverride.criterionName}</p>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Set Status To:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOverrideTargetStatus('PASS')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                      overrideTargetStatus === 'PASS'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Pass Criterion
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverrideTargetStatus('FAIL')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                      overrideTargetStatus === 'FAIL'
                        ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Fail Criterion
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Clinical Rationale (Required for Audit Trail):</label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Discussed with Dr. Thorne. Recent brain MRI on 2026-08-15 confirms stable post-radiation changes without active disease progression..."
                  className="w-full h-24 rounded-lg bg-slate-950 border border-slate-700 p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedCriterionForOverride(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyOverride}
                  disabled={!overrideReason.trim()}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-xs text-white font-medium shadow-md shadow-cyan-600/20"
                >
                  Confirm & Sign Override
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
