import { NextRequest, NextResponse } from 'next/server';
import { ClinicianOverrideSchema } from '@/lib/validation/schemas';
import { ClinicalAuditLog } from '@/types/recruitment';

// In-memory audit log store (mirrors PostgreSQL on Aurora clinical_audit_logs table)
const AUDIT_LOGS: ClinicalAuditLog[] = [
  {
    id: 'audit-001',
    timestamp: '2026-09-14T18:20:00Z',
    actorName: 'Dr. Aris Thorne, MD',
    actorRole: 'Principal Investigator',
    actionType: 'PHYSICIAN_SIGN_OFF',
    patientId: 'p-001',
    patientMrn: 'MRN-784920',
    trialId: 'trial-bond-001',
    details: 'Investigator review: Eleanor Vance fully eligible for BOND-001. All 7 inclusion criteria and 0 exclusions verified.'
  },
  {
    id: 'audit-002',
    timestamp: '2026-09-14T17:40:00Z',
    actorName: 'Sarah Lin, RN',
    actorRole: 'Clinical Research Coordinator',
    actionType: 'VOICE_SCREENING_COMPLETED',
    patientId: 'p-001',
    trialId: 'trial-bond-001',
    details: 'AI Voice Screener conducted 1:05 screening call. Patient confirmed availability for biweekly Tuesday morning clinic visits.'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: AUDIT_LOGS.length,
    auditLogs: AUDIT_LOGS
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ClinicianOverrideSchema.parse(body);

    const newLog: ClinicalAuditLog = {
      id: `audit-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actorName: validated.clinicianName,
      actorRole: validated.clinicianRole as any,
      actionType: 'CLINICAL_OVERRIDE',
      patientId: validated.patientId,
      details: `Clinician override applied to criterion ${validated.criterionId}: Status changed to ${validated.overriddenStatus}. Rationale: ${validated.overrideReason}`,
      evidenceSnapshot: {
        newStatus: validated.overriddenStatus,
        overrideReason: validated.overrideReason
      }
    };

    AUDIT_LOGS.unshift(newLog);

    return NextResponse.json({
      success: true,
      message: 'Clinical override recorded in audit trail',
      auditLog: newLog
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to record audit log' }, { status: 400 });
  }
}
