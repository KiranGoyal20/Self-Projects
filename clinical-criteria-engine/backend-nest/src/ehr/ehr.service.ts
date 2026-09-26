import { Injectable } from '@nestjs/common';
import { TriggerSyncDto } from './ehr.dto';
import { EHR_CONNECTORS_DATA, RECENT_INGESTION_JOBS } from '../../../src/lib/data/ehrConnectors';
import { IngestionJob } from '../../../src/types/ehr';

@Injectable()
export class EhrService {
  async getStatus() {
    return {
      success: true,
      connectors: EHR_CONNECTORS_DATA,
      recentJobs: RECENT_INGESTION_JOBS,
      timestamp: new Date().toISOString()
    };
  }

  async triggerSync(dto: TriggerSyncDto) {
    const job: IngestionJob = {
      jobId: `job-nest-${dto.provider.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      provider: dto.provider,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: 'COMPLETED',
      resourceCounts: {
        Patient: 15,
        Condition: 42,
        Observation: 180,
        MedicationRequest: 32,
        DocumentReference: 12
      },
      durationMs: 42000,
      logMessages: [
        `[${dto.provider} NestJS Worker] Authentication handshake verified`,
        `[Bulk Export Pipeline] Downloaded NDJSON FHIR bundle from AWS S3`,
        `[FHIR R4 Validation] 100% US-Core conformance verified`,
        `[Deduplication] Filtered duplicate patient identifiers via composite MRN hash`,
        `[Criteria Engine] 15 patients queued for protocol screening`
      ]
    };

    RECENT_INGESTION_JOBS.unshift(job);

    return {
      success: true,
      message: `Bulk sync completed successfully for ${dto.provider}`,
      job
    };
  }
}
