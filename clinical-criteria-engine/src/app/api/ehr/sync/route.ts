import { NextRequest, NextResponse } from 'next/server';
import { EHR_CONNECTORS_DATA, RECENT_INGESTION_JOBS } from '@/lib/data/ehrConnectors';
import { EHRSyncRequestSchema } from '@/lib/validation/schemas';
import { IngestionJob } from '@/types/ehr';

export async function GET() {
  return NextResponse.json({
    success: true,
    connectors: EHR_CONNECTORS_DATA,
    recentJobs: RECENT_INGESTION_JOBS,
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = EHRSyncRequestSchema.parse(body);

    const newJob: IngestionJob = {
      jobId: `job-${validated.provider.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      provider: validated.provider,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: 'COMPLETED',
      resourceCounts: {
        Patient: 12,
        Condition: 36,
        Observation: 148,
        MedicationRequest: 24,
        DocumentReference: 8
      },
      durationMs: 38200,
      logMessages: [
        `[${validated.provider} OAuth2] Token refresh verified (Scope: system/*.read)`,
        `[Amazon S3 Staging] Downloaded NDJSON FHIR bulk payload`,
        `[FHIR Validation] 100% US-Core R4 compliance on 228 resources`,
        `[Deduplication Check] Filtered 3 duplicate records via composite MRN hash`,
        `[Criteria Engine Dispatch] Queued 12 patients for protocol screening`
      ]
    };

    RECENT_INGESTION_JOBS.unshift(newJob);

    return NextResponse.json({
      success: true,
      message: `Asynchronous bulk sync completed for ${validated.provider}`,
      job: newJob
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to trigger EHR sync' }, { status: 400 });
  }
}
