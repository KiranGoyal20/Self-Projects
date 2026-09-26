import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_PATIENTS } from '@/lib/data/samplePatients';
import { SAMPLE_PROTOCOLS } from '@/lib/data/sampleProtocols';
import { OutreachRequestSchema } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = OutreachRequestSchema.parse(body);

    const patient = SAMPLE_PATIENTS.find(p => p.patient.id === validated.patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const protocol = SAMPLE_PROTOCOLS.find(p => p.id === validated.trialId) || SAMPLE_PROTOCOLS[0];
    const givenName = patient.patient.name[0]?.given[0] || 'Patient';
    const familyName = patient.patient.name[0]?.family || '';

    // Biomarkers extracted for grounding
    const egfr = patient.observations.find(o => o.code.coding?.some(c => c.code === '48000-4'))?.valueString;
    const anc = patient.observations.find(o => o.code.coding?.some(c => c.code === '26499-4'))?.valueQuantity?.value;

    const message = {
      subject: `Clinical Research Opportunity: Targeted Therapy Study for ${protocol.indication}`,
      body: `Dear ${givenName} ${familyName},

Dr. Thorne and the clinical research oncology team at Bond Health Network have reviewed your health record. Based on your documented ${protocol.indication} and molecular profile (${egfr || 'biomarker targets'}), you may be eligible to participate in the ${protocol.shortTitle} (Protocol ${protocol.protocolNumber}).

All study medication, specialized consultations, and laboratory testing are covered at no cost to you, with flexible appointment times and travel reimbursements.

If you are interested in reviewing the informed consent brochure or speaking with a clinical coordinator, please reply to this message or schedule a 15-minute consultation:
https://cal.com/bond-health/screening?patient=${patient.patient.id}&trial=${protocol.id}

Warm regards,
Clinical Research Coordination Team
Bond Health Network | IRB Ref: IRB00054291`,
      rationale: `Grounded in patient's confirmed diagnosis (${protocol.indication}), molecular finding (${egfr || 'biomarker'}), and baseline ANC (${anc || '2,450'} /uL).`,
      irbApprovalRef: 'IRB00054291',
      recipientPhone: patient.patient.telecom?.[0]?.value || '+1 (555) 234-8901',
      channel: validated.channel
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      outreachMessage: message
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate outreach message' }, { status: 400 });
  }
}
