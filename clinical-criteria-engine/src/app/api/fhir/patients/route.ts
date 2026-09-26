import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_PATIENTS } from '@/lib/data/samplePatients';
import { FHIRPatientRecord } from '@/types/fhir';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ehrSource = searchParams.get('ehrSource');
    const mrn = searchParams.get('mrn');
    const query = searchParams.get('q')?.toLowerCase();

    let patients = [...SAMPLE_PATIENTS];

    if (ehrSource && ehrSource !== 'ALL') {
      patients = patients.filter(p => p.ehrSource === ehrSource);
    }

    if (mrn) {
      patients = patients.filter(p => p.patient.identifier?.some(id => id.value === mrn));
    }

    if (query) {
      patients = patients.filter(p => {
        const name = `${p.patient.name[0]?.given.join(' ')} ${p.patient.name[0]?.family}`.toLowerCase();
        return name.includes(query) || p.patient.identifier?.[0]?.value.toLowerCase().includes(query);
      });
    }

    return NextResponse.json({
      success: true,
      totalCount: patients.length,
      patients: patients.map(p => ({
        id: p.patient.id,
        mrn: p.patient.identifier?.[0]?.value,
        name: `${p.patient.name[0]?.given.join(' ')} ${p.patient.name[0]?.family}`,
        gender: p.patient.gender,
        birthDate: p.patient.birthDate,
        ehrSource: p.ehrSource,
        conditionCount: p.conditions.length,
        observationCount: p.observations.length,
        documentCount: p.documents.length,
        lastSynced: p.lastSynced
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Ingest custom patient record
    if (!body.patient || !body.patient.id) {
      return NextResponse.json({ error: 'Invalid FHIR Patient record: missing patient id' }, { status: 400 });
    }

    const newRecord: FHIRPatientRecord = {
      patient: body.patient,
      conditions: body.conditions || [],
      observations: body.observations || [],
      medications: body.medications || [],
      procedures: body.procedures || [],
      documents: body.documents || [],
      ehrSource: body.ehrSource || 'Epic',
      lastSynced: new Date().toISOString()
    };

    SAMPLE_PATIENTS.push(newRecord);

    return NextResponse.json({
      success: true,
      message: 'FHIR Patient record ingested and indexed successfully',
      patientId: newRecord.patient.id,
      timestamp: new Date().toISOString()
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
