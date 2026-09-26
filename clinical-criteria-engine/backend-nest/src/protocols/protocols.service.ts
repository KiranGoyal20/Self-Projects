import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProtocolDto } from './protocols.dto';
import { SAMPLE_PROTOCOLS } from '../../../src/lib/data/sampleProtocols';
import { TrialProtocol } from '../../../src/types/protocol';

@Injectable()
export class ProtocolsService {
  async findAll() {
    return {
      success: true,
      count: SAMPLE_PROTOCOLS.length,
      protocols: SAMPLE_PROTOCOLS
    };
  }

  async findOne(id: string) {
    const protocol = SAMPLE_PROTOCOLS.find(p => p.id === id);
    if (!protocol) {
      throw new NotFoundException(`Protocol "${id}" not found`);
    }
    return { success: true, protocol };
  }

  async create(dto: CreateProtocolDto) {
    const newProtocol: TrialProtocol = {
      id: `trial-bond-${Date.now().toString().slice(-4)}`,
      nctId: dto.nctId,
      protocolNumber: dto.protocolNumber,
      title: dto.title,
      shortTitle: dto.shortTitle,
      indication: dto.indication,
      diseaseArea: dto.diseaseArea,
      phase: dto.phase,
      sponsor: dto.sponsor,
      principalInvestigator: dto.principalInvestigator,
      targetEnrollment: dto.targetEnrollment,
      currentEnrolled: 0,
      status: 'RECRUITING',
      criteria: dto.criteria
    };

    SAMPLE_PROTOCOLS.push(newProtocol);

    return {
      success: true,
      message: 'Protocol created and registered for screening',
      protocol: newProtocol
    };
  }
}
