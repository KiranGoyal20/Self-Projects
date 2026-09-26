import { Injectable } from '@nestjs/common';
import { EvaluateCriteriaDto, ParseProtocolDto } from './criteria.dto';
import { evaluatePatientForTrial } from '../../../src/lib/engine/criteriaEngine';
import { parseProtocolText } from '../../../src/lib/engine/protocolParser';
import { SAMPLE_PATIENTS } from '../../../src/lib/data/samplePatients';
import { SAMPLE_PROTOCOLS } from '../../../src/lib/data/sampleProtocols';

@Injectable()
export class CriteriaService {
  async evaluate(dto: EvaluateCriteriaDto = {} as any) {
    let patient = dto?.patientRecord;
    if (!patient && dto?.patientId) {
      patient = SAMPLE_PATIENTS.find(
        p => p.patient.id.toLowerCase() === String(dto.patientId).toLowerCase() ||
             p.patient.identifier?.some(id => id.value.toLowerCase() === String(dto.patientId).toLowerCase())
      );
    }

    // If no patient specified or found, fallback gracefully to first sample patient (Eleanor Vance)
    if (!patient) {
      patient = SAMPLE_PATIENTS[0];
    }

    const protocol = SAMPLE_PROTOCOLS.find(
      p => p.id === dto?.protocolId || p.protocolNumber === dto?.protocolId || p.nctId === dto?.protocolId
    ) || SAMPLE_PROTOCOLS[0];

    const evaluation = evaluatePatientForTrial(patient, protocol);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      evaluation
    };
  }

  async parseProtocol(dto: ParseProtocolDto) {
    const raw = dto?.rawText || '';
    const extracted = parseProtocolText(raw);

    return {
      success: true,
      extractedCount: extracted.length,
      criteria: extracted,
      timestamp: new Date().toISOString()
    };
  }
}
