import { NextRequest, NextResponse } from 'next/server';
import { evaluatePatientForTrial } from '@/lib/engine/criteriaEngine';
import { SAMPLE_PATIENTS } from '@/lib/data/samplePatients';
import { SAMPLE_PROTOCOLS } from '@/lib/data/sampleProtocols';
import { FHIRPatientRecord } from '@/types/fhir';

export async function GET(req: NextRequest) {
  // Convenient GET runner for testing in browser or simple curl
  const targetPatient = SAMPLE_PATIENTS[0];
  const targetProtocol = SAMPLE_PROTOCOLS[0];
  const evaluation = evaluatePatientForTrial(targetPatient, targetProtocol);

  return NextResponse.json({
    success: true,
    message: 'Sample evaluation for patient Eleanor Vance (BOND-001 NSCLC)',
    timestamp: new Date().toISOString(),
    evaluation
  });
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }

    const { patientRecord, patientId, protocolId } = body;

    let targetPatient: FHIRPatientRecord | undefined = patientRecord;
    if (!targetPatient) {
      if (patientId) {
        targetPatient = SAMPLE_PATIENTS.find(
          p => p.patient.id.toLowerCase() === String(patientId).toLowerCase() ||
               p.patient.identifier?.some(id => id.value.toLowerCase() === String(patientId).toLowerCase())
        );
      }
      // If no valid patient provided, default gracefully to first sample patient for ease of testing
      if (!targetPatient) {
        targetPatient = SAMPLE_PATIENTS[0];
      }
    }

    const targetProtocol = SAMPLE_PROTOCOLS.find(
      p => p.id === protocolId || p.protocolNumber === protocolId || p.nctId === protocolId
    ) || SAMPLE_PROTOCOLS[0];

    const evaluation = evaluatePatientForTrial(targetPatient, targetProtocol);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      evaluation
    });
  } catch (err: any) {
    return NextResponse.json(
      { 
        success: false,
        error: err.message || 'Criteria evaluation failed'
      },
      { status: 400 }
    );
  }
}
