import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_PROTOCOLS } from '@/lib/data/sampleProtocols';
import { TrialProtocolSchema } from '@/lib/validation/schemas';
import { TrialProtocol } from '@/types/protocol';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const diseaseArea = searchParams.get('diseaseArea');

    let protocols = [...SAMPLE_PROTOCOLS];
    if (diseaseArea) {
      protocols = protocols.filter(p => p.diseaseArea.toLowerCase() === diseaseArea.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: protocols.length,
      protocols
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TrialProtocolSchema.parse(body);

    const newProtocol: TrialProtocol = {
      id: validated.id || `trial-bond-${Date.now().toString().slice(-4)}`,
      nctId: validated.nctId,
      protocolNumber: validated.protocolNumber,
      title: validated.title,
      shortTitle: validated.shortTitle,
      indication: validated.indication,
      diseaseArea: validated.diseaseArea,
      phase: validated.phase,
      sponsor: validated.sponsor,
      principalInvestigator: validated.principalInvestigator,
      targetEnrollment: validated.targetEnrollment,
      currentEnrolled: validated.currentEnrolled || 0,
      status: validated.status,
      criteria: validated.criteria as any,
      rawProtocolText: validated.rawProtocolText
    };

    SAMPLE_PROTOCOLS.push(newProtocol);

    return NextResponse.json({
      success: true,
      message: 'Clinical trial protocol registered successfully',
      protocol: newProtocol
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Validation error' }, { status: 400 });
  }
}
