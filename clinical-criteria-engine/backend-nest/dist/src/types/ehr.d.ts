export type EHRProvider = 'Epic' | 'athenahealth' | 'eClinicalWorks' | 'OncoEMR';
export interface EHRConnectorStatus {
    id: string;
    provider: EHRProvider;
    name: string;
    endpointUrl: string;
    authType: 'SMART_ON_FHIR' | 'OAUTH2_CLIENT_CREDENTIALS' | 'MUTUAL_TLS' | 'API_KEY';
    status: 'CONNECTED' | 'SYNCING' | 'RATE_LIMITED' | 'RETRY_BACKOFF' | 'ERROR';
    fhirVersion: 'R4' | 'US_CORE_3_1_1' | 'US_CORE_6_0_0';
    totalPatientsMapped: number;
    lastSyncTimestamp: string;
    nextScheduledSync: string;
    rateLimitRemaining: number;
    rateLimitMax: number;
    tokenExpiresInMinutes: number;
    currentPaginationCursor?: string;
    recordsIngestedThisHour: number;
    duplicateRecordsFiltered: number;
    activeWorkers: number;
    errorRetryCount: number;
}
export interface IngestionJob {
    jobId: string;
    provider: EHRProvider;
    startedAt: string;
    completedAt?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PARTIALLY_FAILED';
    resourceCounts: {
        Patient: number;
        Condition: number;
        Observation: number;
        MedicationRequest: number;
        DocumentReference: number;
    };
    durationMs: number;
    logMessages: string[];
}
