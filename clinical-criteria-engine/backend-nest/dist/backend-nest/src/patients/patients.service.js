"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const samplePatients_1 = require("../../../src/lib/data/samplePatients");
let PatientsService = class PatientsService {
    async findAll(queryDto) {
        let list = [...samplePatients_1.SAMPLE_PATIENTS];
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
    async findOne(id) {
        const record = samplePatients_1.SAMPLE_PATIENTS.find(p => p.patient.id === id);
        if (!record) {
            throw new common_1.BadRequestException(`Patient "${id}" not found`);
        }
        return {
            success: true,
            record
        };
    }
    async ingest(dto) {
        if (!dto.patient?.id) {
            throw new common_1.BadRequestException('Invalid FHIR payload: patient.id is required');
        }
        const record = {
            patient: dto.patient,
            conditions: dto.conditions || [],
            observations: dto.observations || [],
            medications: dto.medications || [],
            procedures: [],
            documents: dto.documents || [],
            ehrSource: dto.ehrSource || 'Epic',
            lastSynced: new Date().toISOString()
        };
        samplePatients_1.SAMPLE_PATIENTS.unshift(record);
        return {
            success: true,
            message: `Patient ${record.patient.id} successfully ingested into FHIR repository`,
            patientId: record.patient.id
        };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)()
], PatientsService);
//# sourceMappingURL=patients.service.js.map