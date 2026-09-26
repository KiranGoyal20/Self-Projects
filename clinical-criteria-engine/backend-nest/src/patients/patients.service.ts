import { Injectable, BadRequestException } from '@nestjs/common';
import { QueryPatientsDto, IngestFhirPatientDto } from './patients.dto';
import { SAMPLE_PATIENTS } from '../../../src/lib/data/samplePatients';
import { FHIRPatientRecord } from '../../../src/types/fhir';

@Injectable()
export class PatientsService {
  async findAll(queryDto: QueryPatientsDto) {
    let list = [...SAMPLE_PATIENTS];

    if (queryDto.ehrSource && queryDto.ehrSource !== 'ALL') {
      list = list.filter(p => p.ehrSource.toLowerCase() === queryDto.ehrSource.toLowerCase());
    }

    if (queryDto.mrn) {
      list = list.filter(p => p.patient.identifier?.some(id => id.value.toLowerCase().includes(queryDto.mrn.toLowerCase())));
    }

    if (queryDto.query) {
      const q = queryDto.query.toLowerCase();
      list = list.filter(p => {
        const fullName = `${p.patient.name[0]?.given.join(' ')} ${p.patient.name[0]?.family}`.toLowerCase();
        return fullName.includes(q) || p.patient.identifier?.[0]?.value.toLowerCase().includes(q);
      });
    }

    return {
      success: true,
      total: list.length,
      patients: list.map(p => ({
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
    };
  }

  async findOne(id: string) {
    const record = SAMPLE_PATIENTS.find(p => p.patient.id === id);
    if (!record) {
      throw new BadRequestException(`Patient "${id}" not found`);
    }
    return {
      success: true,
      record
    };
  }

  async ingest(dto: IngestFhirPatientDto) {
    if (!dto.patient?.id) {
      throw new BadRequestException('Invalid FHIR payload: patient.id is required');
    }

    const record: FHIRPatientRecord = {
      patient: dto.patient,
      conditions: dto.conditions || [],
      observations: dto.observations || [],
      medications: dto.medications || [],
      procedures: [],
      documents: dto.documents || [],
      ehrSource: dto.ehrSource || 'Epic',
      lastSynced: new Date().toISOString()
    };

    SAMPLE_PATIENTS.unshift(record);

    return {
      success: true,
      message: `Patient ${record.patient.id} successfully ingested into FHIR repository`,
      patientId: record.patient.id
    };
  }
}
