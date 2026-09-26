'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Code, 
  Database,
  ArrowRight,
  Stethoscope,
  Clock,
  Dna
} from 'lucide-react';
import { TrialProtocol, CriterionRule, CriterionCategory, RuleOperator, CriterionType } from '@/types/protocol';
import { parseProtocolText } from '@/lib/engine/protocolParser';

interface ProtocolStudioProps {
  protocol: TrialProtocol;
  onUpdateProtocol: (updated: TrialProtocol) => void;
}

export const ProtocolStudio: React.FC<ProtocolStudioProps> = ({
  protocol,
  onUpdateProtocol,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'INCLUSION' | 'EXCLUSION'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // AI Parser Modal State
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [rawText, setRawText] = useState(protocol.rawProtocolText || `Protocol Inclusion Criteria:
1. Adult patients aged 18 to 75 years.
2. Histologically proven advanced or metastatic Stage IV Non-Small Cell Lung Cancer (NSCLC).
3. Documented activating EGFR mutation (Exon 19 del or L858R).
4. Bone marrow function: Absolute Neutrophil Count (ANC) >= 1,500/uL, Platelets >= 100,000/uL.
5. Renal function: eGFR >= 60 mL/min/1.73m2.
6. ECOG performance status 0 or 1.

Exclusion Criteria:
1. Active, symptomatic or untreated CNS brain metastases.
2. Prior cytotoxic systemic chemotherapy within 28 days prior to cycle 1 day 1.
3. Corrected QT interval (QTcF) greater than 470 ms.`);
  const [parsedPreview, setParsedPreview] = useState<CriterionRule[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  // Manual Criterion Addition State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<CriterionRule>>({
    type: 'INCLUSION',
    category: 'LABORATORY',
    name: '',
    description: '',
    operator: '>=',
    thresholdValue: 0,
    systemName: 'LOINC',
    requiredForEligibility: true,
  });

  const handleRunAiParser = () => {
    setIsParsing(true);
    setTimeout(() => {
      const extracted = parseProtocolText(rawText);
      setParsedPreview(extracted);
      setIsParsing(false);
    }, 450);
  };

  const handleApplyParsedCriteria = () => {
    if (parsedPreview.length === 0) return;
    const updated: TrialProtocol = {
      ...protocol,
      criteria: parsedPreview,
      rawProtocolText: rawText,
    };
    onUpdateProtocol(updated);
    setIsParserOpen(false);
  };

  const handleAddManualRule = () => {
    if (!newRule.name) return;
    const rule: CriterionRule = {
      id: `c-custom-${Date.now()}`,
      type: (newRule.type as CriterionType) || 'INCLUSION',
      category: (newRule.category as CriterionCategory) || 'CONDITION',
      name: newRule.name || 'Custom Criterion',
      description: newRule.description || '',
      operator: (newRule.operator as RuleOperator) || '>=',
      thresholdValue: newRule.thresholdValue,
      systemName: newRule.systemName,
      systemCode: newRule.systemCode,
      expectedUnit: newRule.expectedUnit,
      requiredForEligibility: true,
    };

    onUpdateProtocol({
      ...protocol,
      criteria: [...protocol.criteria, rule],
    });
    setIsAddOpen(false);
    setNewRule({
      type: 'INCLUSION',
      category: 'LABORATORY',
      name: '',
      description: '',
      operator: '>=',
      thresholdValue: 0,
      requiredForEligibility: true,
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    onUpdateProtocol({
      ...protocol,
      criteria: protocol.criteria.filter(c => c.id !== ruleId),
    });
  };

  const filteredCriteria = protocol.criteria.filter(crit => {
    if (activeTab !== 'all' && crit.type !== activeTab) return false;
    if (categoryFilter !== 'ALL' && crit.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Studio Header & AI Parser Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Protocol Criteria Studio</h2>
            <span className="text-xs bg-slate-800 text-cyan-300 font-mono px-2 py-0.5 rounded border border-slate-700">
              {protocol.protocolNumber}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Structured criteria definitions powering the clinical evaluation engine ({protocol.criteria.length} rules loaded)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsParserOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Protocol Ingestion & Parser</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition"
          >
            <Plus className="h-4 w-4 text-cyan-400" />
            <span>Add Rule</span>
          </button>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Criteria ({protocol.criteria.length})
          </button>
          <button
            onClick={() => setActiveTab('INCLUSION')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'INCLUSION' ? 'bg-sky-900/60 text-sky-300 border border-sky-700 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inclusions ({protocol.criteria.filter(c => c.type === 'INCLUSION').length})
          </button>
          <button
            onClick={() => setActiveTab('EXCLUSION')}
            className={`px-3 py-1 rounded-md transition ${
              activeTab === 'EXCLUSION' ? 'bg-rose-900/60 text-rose-300 border border-rose-700 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exclusions ({protocol.criteria.filter(c => c.type === 'EXCLUSION').length})
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          {['ALL', 'DEMOGRAPHICS', 'CONDITION', 'LABORATORY', 'MEDICATION', 'CLINICAL_NOTE'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg border transition ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 font-medium'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Domains' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Criteria Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCriteria.map((crit) => {
          const isInclusion = crit.type === 'INCLUSION';

          return (
            <div
              key={crit.id}
              className={`rounded-xl border p-4 transition glass-panel glass-panel-hover relative group ${
                isInclusion ? 'border-sky-900/40 bg-sky-950/10' : 'border-rose-900/40 bg-rose-950/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                    isInclusion ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {isInclusion ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white">{crit.name}</h4>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                        isInclusion ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {crit.type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mt-0.5">
                      Domain: {crit.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRule(crit.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition p-1"
                  title="Remove criterion"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-3 pl-10 leading-relaxed">
                {crit.description}
              </p>

              {/* Machine Definition Pill */}
              <div className="mt-3 pl-10 flex flex-wrap gap-1.5 text-[11px] font-mono">
                {crit.operator && (
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 border border-slate-700">
                    Operator: <strong className="text-cyan-400">{crit.operator}</strong>
                  </span>
                )}
                {crit.thresholdValue !== undefined && (
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 border border-slate-700">
                    Threshold: <strong className="text-emerald-400">{crit.thresholdValue.toLocaleString()} {crit.expectedUnit}</strong>
                  </span>
                )}
                {crit.thresholdRange && (
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 border border-slate-700">
                    Range: <strong className="text-emerald-400">{crit.thresholdRange.min} - {crit.thresholdRange.max} {crit.expectedUnit}</strong>
                  </span>
                )}
                {crit.thresholdString && (
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-slate-300 border border-slate-700">
                    Match: <strong className="text-amber-300">{crit.thresholdString}</strong>
                  </span>
                )}
                {crit.systemCode && (
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-cyan-300 border border-cyan-800/60">
                    {crit.systemName}: {crit.systemCode}
                  </span>
                )}
                {crit.timeWindowDays && (
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Window: {crit.timeWindowDays} days</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Protocol Parser Modal */}
      {isParserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">AI Protocol Ingestion & Criteria Extractor</h3>
                  <p className="text-xs text-slate-400">Extracts structured LOINC, ICD-10, and temporal rules from protocol text</p>
                </div>
              </div>
              <button
                onClick={() => setIsParserOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Paste Clinical Trial Protocol Synopsis (Inclusion / Exclusion Text):
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handleRunAiParser}
                  disabled={isParsing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isParsing ? 'Parsing Protocol...' : 'Run Extraction & Structure Rules'}</span>
                </button>

                {parsedPreview.length > 0 && (
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    ✓ Extracted {parsedPreview.length} criteria rules
                  </span>
                )}
              </div>

              {/* Parsed Output Preview */}
              {parsedPreview.length > 0 && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-300">Structured Rule Schema Preview</span>
                    <span className="text-[10px] text-cyan-400 font-mono">LOINC / ICD-10 Normalization</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {parsedPreview.map((p, idx) => (
                      <div key={idx} className="rounded-lg bg-slate-900 p-3 border border-slate-800 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                            p.type === 'INCLUSION' ? 'bg-sky-950 text-sky-400' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {p.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{p.description}</p>
                        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] text-slate-400">
                          <span>{p.systemName ? `${p.systemName}: ${p.systemCode}` : 'Text rule'}</span>
                          <span>•</span>
                          <span className="text-cyan-400">{p.operator} {p.thresholdValue || p.thresholdString || `${p.thresholdRange?.min}-${p.thresholdRange?.max}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-800 bg-slate-950/80 px-6 py-4">
              <button
                onClick={() => setIsParserOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyParsedCriteria}
                disabled={parsedPreview.length === 0}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs text-white font-medium shadow-md shadow-indigo-600/20"
              >
                Apply Rules to Protocol ({parsedPreview.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Criterion Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Add Structured Criterion Rule</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Criterion Type:</label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as CriterionType })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                  >
                    <option value="INCLUSION">INCLUSION</option>
                    <option value="EXCLUSION">EXCLUSION</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Clinical Domain:</label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value as CriterionCategory })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                  >
                    <option value="LABORATORY">LABORATORY</option>
                    <option value="CONDITION">CONDITION</option>
                    <option value="DEMOGRAPHICS">DEMOGRAPHICS</option>
                    <option value="MEDICATION">MEDICATION</option>
                    <option value="CLINICAL_NOTE">CLINICAL NOTE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Rule Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Absolute Neutrophil Count (ANC) >= 1500"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description / Protocol Text:</label>
                <textarea
                  placeholder="e.g. Absolute neutrophil count >= 1,500 /uL at baseline..."
                  value={newRule.description || ''}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200 h-16"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Operator:</label>
                  <select
                    value={newRule.operator}
                    onChange={(e) => setNewRule({ ...newRule, operator: e.target.value as RuleOperator })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                  >
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value="==">==</option>
                    <option value="BETWEEN">BETWEEN</option>
                    <option value="EXISTS">EXISTS</option>
                    <option value="WITHIN_DAYS">WITHIN DAYS</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Threshold Value:</label>
                  <input
                    type="number"
                    value={newRule.thresholdValue ?? ''}
                    onChange={(e) => setNewRule({ ...newRule, thresholdValue: parseFloat(e.target.value) })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit:</label>
                  <input
                    type="text"
                    placeholder="/uL or %"
                    value={newRule.expectedUnit || ''}
                    onChange={(e) => setNewRule({ ...newRule, expectedUnit: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Code System:</label>
                  <select
                    value={newRule.systemName}
                    onChange={(e) => setNewRule({ ...newRule, systemName: e.target.value as any })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                  >
                    <option value="LOINC">LOINC (Labs)</option>
                    <option value="ICD-10">ICD-10 (Diagnoses)</option>
                    <option value="RxNorm">RxNorm (Meds)</option>
                    <option value="SNOMED-CT">SNOMED-CT</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Code Value:</label>
                  <input
                    type="text"
                    placeholder="e.g. 26499-4"
                    value={newRule.systemCode || ''}
                    onChange={(e) => setNewRule({ ...newRule, systemCode: e.target.value })}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddManualRule}
                disabled={!newRule.name}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-xs text-white font-medium"
              >
                Add Rule to Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
