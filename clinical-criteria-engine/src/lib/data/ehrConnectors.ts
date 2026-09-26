import { EHRConnectorStatus, IngestionJob } from '@/types/ehr';

export const EHR_CONNECTORS_DATA: EHRConnectorStatus[] = [
  {
    id: 'ehr-epic',
    provider: 'Epic',
    name: 'Epic Systems (Mass General Brigham FHIR Sandbox)',
    endpointUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    authType: 'SMART_ON_FHIR',
    status: 'CONNECTED',
    fhirVersion: 'US_CORE_6_0_0',
    totalPatientsMapped: 1420,
    lastSyncTimestamp: '2026-09-14T18:30:00Z',
    nextScheduledSync: '2026-09-14T22:30:00Z',
    rateLimitRemaining: 9480,
    rateLimitMax: 10000,
    tokenExpiresInMinutes: 44,
    currentPaginationCursor: 'eyJwYWdlIjo1OCwib2Zmc2V0IjoxMTYwfQ==',
    recordsIngestedThisHour: 320,
    duplicateRecordsFiltered: 14,
    activeWorkers: 4,
    errorRetryCount: 0
  },
  {
    id: 'ehr-athena',
    provider: 'athenahealth',
    name: 'athenahealth MDR & Bulk Export Pipeline',
    endpointUrl: 'https://api.platform.athenahealth.com/v1/fhir/r4',
    authType: 'OAUTH2_CLIENT_CREDENTIALS',
    status: 'CONNECTED',
    fhirVersion: 'R4',
    totalPatientsMapped: 890,
    lastSyncTimestamp: '2026-09-14T17:45:00Z',
    nextScheduledSync: '2026-09-14T21:45:00Z',
    rateLimitRemaining: 4820,
    rateLimitMax: 5000,
    tokenExpiresInMinutes: 28,
    currentPaginationCursor: 'cursor_ath_v2_p38',
    recordsIngestedThisHour: 184,
    duplicateRecordsFiltered: 6,
    activeWorkers: 3,
    errorRetryCount: 1
  },
  {
    id: 'ehr-ecw',
    provider: 'eClinicalWorks',
    name: 'eClinicalWorks API Gateway v2',
    endpointUrl: 'https://fhir.eclinicalworks.com/fhir/r4/BOND_HEALTH_SITE',
    authType: 'MUTUAL_TLS',
    status: 'CONNECTED',
    fhirVersion: 'R4',
    totalPatientsMapped: 615,
    lastSyncTimestamp: '2026-09-14T16:15:00Z',
    nextScheduledSync: '2026-09-14T20:15:00Z',
    rateLimitRemaining: 2890,
    rateLimitMax: 3000,
    tokenExpiresInMinutes: 52,
    recordsIngestedThisHour: 96,
    duplicateRecordsFiltered: 2,
    activeWorkers: 2,
    errorRetryCount: 0
  },
  {
    id: 'ehr-oncoemr',
    provider: 'OncoEMR',
    name: 'OncoEMR / Flatiron Oncology EHR Feed',
    endpointUrl: 'https://api.oncoemr.clinical/fhir/v4/oncology',
    authType: 'SMART_ON_FHIR',
    status: 'CONNECTED',
    fhirVersion: 'US_CORE_3_1_1',
    totalPatientsMapped: 740,
    lastSyncTimestamp: '2026-09-14T18:00:00Z',
    nextScheduledSync: '2026-09-14T22:00:00Z',
    rateLimitRemaining: 1950,
    rateLimitMax: 2000,
    tokenExpiresInMinutes: 36,
    currentPaginationCursor: 'onc_batch_9921',
    recordsIngestedThisHour: 142,
    duplicateRecordsFiltered: 8,
    activeWorkers: 3,
    errorRetryCount: 0
  }
];

export const RECENT_INGESTION_JOBS: IngestionJob[] = [
  {
    jobId: 'job-epic-sync-8819',
    provider: 'Epic',
    startedAt: '2026-09-14T18:25:12Z',
    completedAt: '2026-09-14T18:29:44Z',
    status: 'COMPLETED',
    resourceCounts: {
      Patient: 48,
      Condition: 132,
      Observation: 512,
      MedicationRequest: 84,
      DocumentReference: 38
    },
    durationMs: 272000,
    logMessages: [
      '[Epic OAuth] Token refresh OK (Scope: system/Patient.read system/Observation.read)',
      '[Bulk Export] Fetched NDJSON bundle 2.4 MB from AWS S3 staging bucket',
      '[FHIR Validation] 100% US-Core 6.0 conformance on 814 resources',
      '[Dedup Checkpoint] Filtered 14 duplicate records via composite MRN-hash',
      '[Criteria Triggers] 48 patients automatically queued for clinical eligibility screening'
    ]
  },
  {
    jobId: 'job-onco-sync-8820',
    provider: 'OncoEMR',
    startedAt: '2026-09-14T17:55:00Z',
    completedAt: '2026-09-14T17:59:18Z',
    status: 'COMPLETED',
    resourceCounts: {
      Patient: 24,
      Condition: 78,
      Observation: 310,
      MedicationRequest: 45,
      DocumentReference: 28
    },
    durationMs: 258000,
    logMessages: [
      '[OncoEMR Connector] Auth handshake successful with Flatiron FHIR bridge',
      '[Incremental Sync] Checkpoint offset updated: cursor_onco_9948',
      '[Genomics Extraction] Extracted 18 EGFR, ALK, KRAS molecular reports',
      '[Criteria Triggers] Queued 24 oncology patients for BOND-LUNG-001 protocol match'
    ]
  }
];
