'use client';

import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Clock, 
  ShieldCheck, 
  Server, 
  FileCode, 
  Cpu,
  Layers,
  Terminal
} from 'lucide-react';
import { EHR_CONNECTORS_DATA, RECENT_INGESTION_JOBS } from '@/lib/data/ehrConnectors';
import { EHRConnectorStatus, IngestionJob, EHRProvider } from '@/types/ehr';
import { FHIRPatientRecord } from '@/types/fhir';

interface EHRIntegrationHubProps {
  onIngestNewPatientRecord?: (record: FHIRPatientRecord) => void;
}

export const EHRIntegrationHub: React.FC<EHRIntegrationHubProps> = ({
  onIngestNewPatientRecord,
}) => {
  const [connectors, setConnectors] = useState<EHRConnectorStatus[]>(EHR_CONNECTORS_DATA);
  const [recentJobs, setRecentJobs] = useState<IngestionJob[]>(RECENT_INGESTION_JOBS);
  const [activeSyncingProvider, setActiveSyncingProvider] = useState<EHRProvider | null>(null);
  const [rawFhirJson, setRawFhirJson] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Trigger Mock Sync for a Provider
  const handleTriggerSync = (provider: EHRProvider) => {
    setActiveSyncingProvider(provider);
    
    setTimeout(() => {
      // Create new mock completed job
      const newJob: IngestionJob = {
        jobId: `job-${provider.toLowerCase()}-${Date.now().toString().slice(-4)}`,
        provider,
        startedAt: new Date().toISOString(),
        completedAt: new Date(Date.now() + 45000).toISOString(),
        status: 'COMPLETED',
        resourceCounts: {
          Patient: 12,
          Condition: 36,
          Observation: 148,
          MedicationRequest: 24,
          DocumentReference: 8
        },
        durationMs: 45000,
        logMessages: [
          `[${provider} OAuth] Refreshed bearer token successfully`,
          `[Pagination] Incremental fetch checkpoint offset updated`,
          `[FHIR Validation] 100% US-Core R4 compliance on 228 resources`,
          `[Criteria Triggers] Queued 12 new patients for clinical trial screening`
        ]
      };

      setRecentJobs(prev => [newJob, ...prev]);
      setActiveSyncingProvider(null);

      // Update connector stats
      setConnectors(prev => prev.map(c => {
        if (c.provider === provider) {
          return {
            ...c,
            totalPatientsMapped: c.totalPatientsMapped + 12,
            lastSyncTimestamp: new Date().toISOString(),
            recordsIngestedThisHour: c.recordsIngestedThisHour + 12,
          };
        }
        return c;
      }));
    }, 2000);
  };

  const handleUploadCustomFhir = () => {
    try {
      if (!rawFhirJson.trim()) return;
      const parsed = JSON.parse(rawFhirJson);
      
      // Basic validation
      if (parsed.resourceType !== 'Bundle' && parsed.resourceType !== 'Patient' && !parsed.patient) {
        setUploadStatus('Invalid FHIR: Must be a FHIR Patient or Bundle');
        return;
      }

      setUploadStatus('Successfully ingested FHIR bundle! Patient queued for screening.');
      setRawFhirJson('');
      setTimeout(() => setUploadStatus(null), 4000);
    } catch (e: any) {
      setUploadStatus(`JSON Parsing Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hub Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">EHR Interoperability & Pipeline Hub</h2>
            <span className="text-xs bg-cyan-950 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-800/60">
              HL7 FHIR R4 / US Core 6.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, token refresh management, bulk exports, and recurring synchronization across partner hospital EHRs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/80 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>4 Gateways Healthy</span>
          </div>
        </div>
      </div>

      {/* Provider Connector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map((connector) => {
          const isSyncing = activeSyncingProvider === connector.provider;

          return (
            <div
              key={connector.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{connector.provider}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {connector.authType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono text-[11px] truncate max-w-sm">
                    {connector.endpointUrl}
                  </p>
                </div>

                <button
                  onClick={() => handleTriggerSync(connector.provider)}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition disabled:opacity-50"
                  title="Trigger incremental FHIR sync"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Mapped Patients</span>
                  <span className="text-slate-200 font-bold text-sm mt-0.5 block">{connector.totalPatientsMapped.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Rate Limit</span>
                  <span className="text-cyan-400 font-bold text-sm mt-0.5 block">
                    {connector.rateLimitRemaining} / {connector.rateLimitMax}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">OAuth Token</span>
                  <span className="text-emerald-400 font-bold text-sm mt-0.5 block">{connector.tokenExpiresInMinutes}m valid</span>
                </div>
              </div>

              {/* Pipeline Telemetry Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3 font-mono">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{connector.recordsIngestedThisHour} records/hr</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{connector.duplicateRecordsFiltered} deduped</span>
                </div>
                <div>
                  Last: {new Date(connector.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ingestion Console & Custom FHIR Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Ingestion Pipeline Audit Log */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Background Worker Ingestion Logs</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">ECS Fargate • SQS Ingestion</span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {recentJobs.map((job) => (
              <div key={job.jobId} className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-bold text-slate-200">{job.provider} • {job.jobId}</span>
                  <span className="text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                    {job.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded">
                  <span>Patients: <strong className="text-slate-200">{job.resourceCounts.Patient}</strong></span>
                  <span>Labs: <strong className="text-cyan-300">{job.resourceCounts.Observation}</strong></span>
                  <span>Conditions: <strong className="text-slate-200">{job.resourceCounts.Condition}</strong></span>
                  <span>Meds: <strong className="text-slate-200">{job.resourceCounts.MedicationRequest}</strong></span>
                </div>

                <div className="space-y-1 font-mono text-[10px] text-slate-400 pl-1 border-l-2 border-cyan-500/40">
                  {job.logMessages.map((msg, i) => (
                    <div key={i} className="truncate">{msg}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Custom FHIR JSON Ingester */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Upload Custom FHIR R4 Bundle</h3>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">Sandbox Ingest</span>
          </div>

          <p className="text-xs text-slate-400">
            Paste a JSON patient record or clinical trial FHIR Bundle to immediately test criteria evaluation against the active protocol.
          </p>

          <textarea
            value={rawFhirJson}
            onChange={(e) => setRawFhirJson(e.target.value)}
            placeholder={`{\n  "resourceType": "Bundle",\n  "type": "collection",\n  "entry": [\n    {\n      "resource": {\n        "resourceType": "Patient",\n        "id": "p-custom-99",\n        "name": [{ "family": "Watson", "given": ["James"] }],\n        "gender": "male",\n        "birthDate": "1968-04-12"\n      }\n    }\n  ]\n}`}
            className="flex-1 min-h-[160px] rounded-xl bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />

          {uploadStatus && (
            <div className={`p-2.5 rounded-lg text-xs font-mono ${
              uploadStatus.includes('Error') ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {uploadStatus}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={handleUploadCustomFhir}
              disabled={!rawFhirJson.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition"
            >
              <Upload className="h-4 w-4" />
              <span>Validate & Ingest FHIR Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
