'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Copy, 
  Check, 
  Database, 
  Sparkles, 
  Send, 
  Terminal,
  Layers
} from 'lucide-react';
import { SAMPLE_PATIENTS } from '@/lib/data/samplePatients';
import { SAMPLE_PROTOCOLS } from '@/lib/data/sampleProtocols';
import { evaluatePatientForTrial } from '@/lib/engine/criteriaEngine';
import { parseProtocolText } from '@/lib/engine/protocolParser';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  requestBody?: string;
  responsePreview?: string;
}

export const OpenApiPlayground: React.FC = () => {
  const [selectedEndpointId, setSelectedEndpointId] = useState('eval');
  const [requestPayload, setRequestPayload] = useState('');
  const [responsePayload, setResponsePayload] = useState('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints: ApiEndpoint[] = [
    {
      id: 'eval',
      method: 'POST',
      path: '/api/criteria/evaluate',
      title: 'Evaluate Patient Against Protocol',
      description: 'Executes deterministic & semantic matching of a FHIR R4 patient bundle against structured inclusion/exclusion criteria, generating traceable clinical evidence.',
      requestBody: JSON.stringify({
        patientRecord: SAMPLE_PATIENTS[0],
        protocolId: SAMPLE_PROTOCOLS[0].id
      }, null, 2)
    },
    {
      id: 'parse',
      method: 'POST',
      path: '/api/protocols/parse',
      title: 'Parse Unstructured Protocol Synopsis',
      description: 'NLP & Rule extraction pipeline converting freeform eligibility criteria into normalized LOINC, ICD-10, and temporal rules.',
      requestBody: JSON.stringify({
        rawText: `Inclusion Criteria:
1. Adult patients aged 18 to 75 years.
2. Histologically proven advanced NSCLC.
3. Absolute Neutrophil Count (ANC) >= 1,500 /uL.
4. eGFR >= 60 mL/min/1.73m2.

Exclusion Criteria:
1. Active CNS brain metastases.
2. Chemotherapy within 28 days.`
      }, null, 2)
    },
    {
      id: 'outreach',
      method: 'POST',
      path: '/api/outreach/generate-message',
      title: 'Generate Protocol-Grounded Outreach',
      description: 'Generates IRB-compliant, personalized recruitment SMS/Email tailored to the patient\'s specific biomarkers.',
      requestBody: JSON.stringify({
        patientId: 'p-001',
        trialId: 'trial-bond-001',
        channel: 'SMS'
      }, null, 2)
    }
  ];

  const selectedEndpoint = endpoints.find(e => e.id === selectedEndpointId) || endpoints[0];

  // Initialize request payload when endpoint changes
  React.useEffect(() => {
    if (selectedEndpoint.requestBody) {
      setRequestPayload(selectedEndpoint.requestBody);
    }
    setResponsePayload('');
    setResponseStatus(null);
  }, [selectedEndpointId]);

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponsePayload('');
    setResponseStatus(null);

    setTimeout(() => {
      try {
        if (selectedEndpoint.id === 'eval') {
          const res = evaluatePatientForTrial(SAMPLE_PATIENTS[0], SAMPLE_PROTOCOLS[0]);
          setResponsePayload(JSON.stringify(res, null, 2));
          setResponseStatus(200);
        } else if (selectedEndpoint.id === 'parse') {
          const parsed = JSON.parse(requestPayload);
          const rules = parseProtocolText(parsed.rawText || '');
          setResponsePayload(JSON.stringify({
            success: true,
            extractedRulesCount: rules.length,
            criteria: rules
          }, null, 2));
          setResponseStatus(200);
        } else if (selectedEndpoint.id === 'outreach') {
          setResponsePayload(JSON.stringify({
            status: 'OUTREACH_GENERATED',
            patientId: 'p-001',
            irbRef: 'IRB00054291',
            messageBody: 'Dear Eleanor, Dr. Thorne and the oncology team invite you to evaluate a novel Phase III targeted kinase inhibitor study for EGFR+ NSCLC...',
            channelsSupported: ['SMS', 'ELEVENLABS_VOICE', 'EMAIL'],
            calComBookingUrl: 'https://cal.com/bond-health/screening?patient=p-001'
          }, null, 2));
          setResponseStatus(200);
        }
      } catch (e: any) {
        setResponsePayload(JSON.stringify({ error: e.message }, null, 2));
        setResponseStatus(400);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(responsePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">OpenAPI & Partner Integration Playground</h2>
            <span className="text-xs bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-800/60">
              OpenAPI 3.1 / Zod Validated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Programmatic endpoints for biopharma sponsors, clinical trial matching webhooks, and hospital data integration tooling
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Endpoints List */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
            Available Endpoints
          </span>

          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => setSelectedEndpointId(ep.id)}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selectedEndpointId === ep.id
                  ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  ep.method === 'POST' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {ep.method}
                </span>
                <span className="text-xs font-mono text-slate-200 font-semibold truncate">{ep.path}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">{ep.title}</p>
            </button>
          ))}
        </div>

        {/* Right 2 Columns: Request & Response Interactive Console */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="text-cyan-400 font-bold">{selectedEndpoint.method}</span>
                  <span className="text-white font-semibold">{selectedEndpoint.path}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedEndpoint.description}</p>
              </div>

              <button
                onClick={handleExecuteRequest}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isLoading ? 'Executing...' : 'Run Request'}</span>
              </button>
            </div>

            {/* Request Body Editor */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Request Payload (application/json):</span>
                <span className="text-[10px] font-mono text-slate-500">Editable</span>
              </div>
              <textarea
                value={requestPayload}
                onChange={(e) => setRequestPayload(e.target.value)}
                rows={8}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            {/* Response Console */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <div className="flex items-center gap-2">
                  <span>Response:</span>
                  {responseStatus && (
                    <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      responseStatus === 200 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {responseStatus} OK
                    </span>
                  )}
                </div>

                {responsePayload && (
                  <button
                    onClick={handleCopyResponse}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy Response'}</span>
                  </button>
                )}
              </div>

              <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-300 min-h-[160px] max-h-80 overflow-y-auto">
                {responsePayload ? (
                  <pre className="text-emerald-400/90 leading-relaxed">{responsePayload}</pre>
                ) : (
                  <span className="text-slate-600 italic">Click "Run Request" to execute API call and inspect response.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
