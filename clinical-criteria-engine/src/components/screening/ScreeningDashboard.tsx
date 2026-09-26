'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Send, 
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Building2,
  RefreshCw
} from 'lucide-react';
import { TrialProtocol, PatientTrialEvaluation } from '@/types/protocol';
import { FHIRPatientRecord } from '@/types/fhir';
import { calculateAge } from '@/lib/engine/criteriaEngine';

interface ScreeningDashboardProps {
  protocol: TrialProtocol;
  evaluations: PatientTrialEvaluation[];
  patientRecords: FHIRPatientRecord[];
  onSelectPatientForEvidence: (patientId: string) => void;
  onInitiateOutreach: (patientId: string) => void;
  onRefreshEvaluation: () => void;
}

export const ScreeningDashboard: React.FC<ScreeningDashboardProps> = ({
  protocol,
  evaluations,
  patientRecords,
  onSelectPatientForEvidence,
  onInitiateOutreach,
  onRefreshEvaluation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW'>('ALL');
  const [ehrFilter, setEhrFilter] = useState<string>('ALL');

  // Stats calculation
  const stats = useMemo(() => {
    const total = evaluations.length;
    const eligible = evaluations.filter(e => e.overallStatus === 'ELIGIBLE').length;
    const ineligible = evaluations.filter(e => e.overallStatus === 'INELIGIBLE').length;
    const needsReview = evaluations.filter(e => e.overallStatus === 'NEEDS_REVIEW').length;
    const matchRate = total > 0 ? Math.round((eligible / total) * 100) : 0;

    return { total, eligible, ineligible, needsReview, matchRate };
  }, [evaluations]);

  // Filtered evaluations
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(ev => {
      const patientRec = patientRecords.find(p => p.patient.id === ev.patientId);
      
      // Status filter
      if (statusFilter !== 'ALL' && ev.overallStatus !== statusFilter) {
        return false;
      }

      // EHR source filter
      if (ehrFilter !== 'ALL' && patientRec?.ehrSource !== ehrFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = ev.patientName.toLowerCase().includes(query);
        const matchesMrn = ev.mrn.toLowerCase().includes(query);
        const matchesBlocker = ev.blockerReasons.some(b => b.toLowerCase().includes(query));
        if (!matchesName && !matchesMrn && !matchesBlocker) return false;
      }

      return true;
    });
  }, [evaluations, patientRecords, statusFilter, ehrFilter, searchQuery]);

  const handleExportCSV = () => {
    const headers = ['MRN', 'Patient Name', 'EHR Source', 'Trial', 'Status', 'Match Score', 'Inclusions Met', 'Blocker Reason'];
    const rows = filteredEvaluations.map(ev => {
      const patientRec = patientRecords.find(p => p.patient.id === ev.patientId);
      return [
        ev.mrn,
        `"${ev.patientName}"`,
        patientRec?.ehrSource || 'Unknown',
        `"${protocol.shortTitle}"`,
        ev.overallStatus,
        `${ev.matchScore}%`,
        `"${ev.inclusionMetCount}/${ev.inclusionTotalCount}"`,
        `"${ev.blockerReasons[0] || 'None'}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Screening_Cohort_${protocol.protocolNumber}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Protocol Summary Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                {protocol.protocolNumber} • {protocol.nctId}
              </span>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800/90 px-2 py-0.5 rounded">
                {protocol.phase}
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                {protocol.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-2 tracking-tight">{protocol.title}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-4xl">
              Principal Investigator: <strong className="text-slate-300">{protocol.principalInvestigator}</strong> • Sponsor: <strong className="text-slate-300">{protocol.sponsor}</strong> • Target Enrollment: <strong className="text-cyan-300">{protocol.currentEnrolled} / {protocol.targetEnrollment} patients</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefreshEvaluation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
              title="Re-run screening criteria engine against active EHR records"
            >
              <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
              <span>Re-run Screening</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export Screening Roster (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Screened */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <span className="text-slate-400 text-xs font-medium">Total Screened Patients</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-white font-mono">{stats.total}</span>
            <span className="text-xs text-cyan-400 font-mono">EHR Cohort</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Across 4 connected EHR endpoints</div>
        </div>

        {/* Eligible */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'ELIGIBLE' ? 'ALL' : 'ELIGIBLE')}
          className={`glass-panel rounded-xl p-4 border cursor-pointer transition ${
            statusFilter === 'ELIGIBLE' ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Eligible Matches</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{stats.eligible}</span>
            <span className="text-xs text-emerald-400/90 font-mono">{stats.matchRate}% Match Rate</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-300/80">Ready for physician sign-off</div>
        </div>

        {/* Needs Review */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'NEEDS_REVIEW' ? 'ALL' : 'NEEDS_REVIEW')}
          className={`glass-panel rounded-xl p-4 border cursor-pointer transition ${
            statusFilter === 'NEEDS_REVIEW' ? 'border-amber-500 bg-amber-950/20' : 'border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Under Review / Borderline</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">{stats.needsReview}</span>
            <span className="text-xs text-amber-400/90 font-mono">Chart Review</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-300/80">Requires clinician confirmation</div>
        </div>

        {/* Ineligible */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'INELIGIBLE' ? 'ALL' : 'INELIGIBLE')}
          className={`glass-panel rounded-xl p-4 border cursor-pointer transition ${
            statusFilter === 'INELIGIBLE' ? 'border-rose-500 bg-rose-950/20' : 'border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Ineligible (Exclusion Hit)</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">{stats.ineligible}</span>
            <span className="text-xs text-rose-400/90 font-mono">{stats.total > 0 ? Math.round((stats.ineligible / stats.total) * 100) : 0}% Excluded</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-300/80">Traceable blocker evidence</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name, MRN, biomarker..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Status Buttons */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            {(['ALL', 'ELIGIBLE', 'NEEDS_REVIEW', 'INELIGIBLE'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  statusFilter === s
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 'ALL' ? 'All' : s === 'ELIGIBLE' ? 'Eligible' : s === 'NEEDS_REVIEW' ? 'Review' : 'Ineligible'}
              </button>
            ))}
          </div>

          {/* EHR Source Selector */}
          <select
            value={ehrFilter}
            onChange={(e) => setEhrFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All EHR Sources</option>
            <option value="Epic">Epic Systems</option>
            <option value="athenahealth">athenahealth</option>
            <option value="eClinicalWorks">eClinicalWorks</option>
            <option value="OncoEMR">OncoEMR</option>
          </select>
        </div>
      </div>

      {/* Patients Data Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">EHR Source</th>
                <th className="py-3 px-4">Eligibility Match</th>
                <th className="py-3 px-4">Inclusions Met</th>
                <th className="py-3 px-4">Key Clinical Findings</th>
                <th className="py-3 px-4">Recruitment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No patient records matched the specified filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvaluations.map((evaluation) => {
                  const patientRec = patientRecords.find(p => p.patient.id === evaluation.patientId);
                  const age = patientRec ? calculateAge(patientRec.patient.birthDate) : 'N/A';
                  const isEligible = evaluation.overallStatus === 'ELIGIBLE';
                  const isExcluded = evaluation.overallStatus === 'INELIGIBLE';

                  // Extract key biomarkers (EGFR, ANC, Platelets, etc.)
                  const egfrObs = patientRec?.observations.find(o => o.code.coding?.some(c => c.code === '48000-4'));
                  const ancObs = patientRec?.observations.find(o => o.code.coding?.some(c => c.code === '26499-4'));
                  const hba1cObs = patientRec?.observations.find(o => o.code.coding?.some(c => c.code === '4548-4'));

                  return (
                    <tr 
                      key={evaluation.patientId} 
                      className="hover:bg-slate-800/40 transition group cursor-pointer"
                      onClick={() => onSelectPatientForEvidence(evaluation.patientId)}
                    >
                      {/* Patient Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isEligible ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' :
                            isExcluded ? 'bg-rose-950 text-rose-300 border border-rose-700/60' :
                            'bg-amber-950 text-amber-300 border border-amber-700/60'
                          }`}>
                            {evaluation.patientName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                              {evaluation.patientName}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                              <span>{evaluation.mrn}</span>
                              <span>•</span>
                              <span>{age} y/o {patientRec?.patient.gender}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* EHR Source */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-[11px] font-mono text-slate-300 border border-slate-700">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span>{patientRec?.ehrSource}</span>
                        </span>
                      </td>

                      {/* Overall Status Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold font-mono ${
                            isEligible ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/80 shadow-sm shadow-emerald-950' :
                            isExcluded ? 'bg-rose-950 text-rose-300 border border-rose-700/80' :
                            'bg-amber-950 text-amber-300 border border-amber-700/80'
                          }`}>
                            {isEligible && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                            {isExcluded && <XCircle className="h-3.5 w-3.5 text-rose-400" />}
                            {!isEligible && !isExcluded && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                            <span>{evaluation.overallStatus}</span>
                          </span>
                        </div>
                      </td>

                      {/* Inclusions Progress */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1 font-mono">
                            <span className="text-slate-300 font-bold">{evaluation.inclusionMetCount} / {evaluation.inclusionTotalCount} Met</span>
                            <span className="text-slate-400">{evaluation.matchScore}%</span>
                          </div>
                          <div className="h-1.5 w-28 rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                isEligible ? 'bg-emerald-500' : isExcluded ? 'bg-rose-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${evaluation.matchScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Clinical Biomarkers or Blocker */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {isExcluded ? (
                          <div className="text-[11px] text-rose-300 truncate" title={evaluation.blockerReasons[0]}>
                            <span className="font-semibold text-rose-400">Blocker: </span>
                            {evaluation.blockerReasons[0]}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                            {egfrObs && (
                              <span className="rounded bg-slate-800/90 text-cyan-300 px-1.5 py-0.5 border border-slate-700">
                                EGFR: {egfrObs.valueString?.includes('Exon 19') ? 'Exon 19 del' : 'L858R'}
                              </span>
                            )}
                            {ancObs && (
                              <span className="rounded bg-slate-800/90 text-slate-300 px-1.5 py-0.5 border border-slate-700">
                                ANC: {ancObs.valueQuantity?.value.toLocaleString()} /uL
                              </span>
                            )}
                            {hba1cObs && (
                              <span className="rounded bg-slate-800/90 text-amber-300 px-1.5 py-0.5 border border-slate-700">
                                HbA1c: {hba1cObs.valueQuantity?.value}%
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectPatientForEvidence(evaluation.patientId)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition border border-slate-700"
                            title="Inspect ground truth FHIR evidence"
                          >
                            <Eye className="h-3 w-3 text-cyan-400" />
                            <span>Evidence</span>
                          </button>
                          {isEligible && (
                            <button
                              onClick={() => onInitiateOutreach(evaluation.patientId)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-md shadow-cyan-600/20"
                              title="Begin AI outreach & voice screening"
                            >
                              <Send className="h-3 w-3" />
                              <span>Outreach</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
