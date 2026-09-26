"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CriteriaService = void 0;
const common_1 = require("@nestjs/common");
const criteriaEngine_1 = require("../../../src/lib/engine/criteriaEngine");
const protocolParser_1 = require("../../../src/lib/engine/protocolParser");
const samplePatients_1 = require("../../../src/lib/data/samplePatients");
const sampleProtocols_1 = require("../../../src/lib/data/sampleProtocols");
let CriteriaService = class CriteriaService {
    async evaluate(dto = {}) {
        let patient = dto?.patientRecord;
        if (!patient && dto?.patientId) {
            patient = samplePatients_1.SAMPLE_PATIENTS.find(p => p.patient.id.toLowerCase() === String(dto.patientId).toLowerCase() ||
                p.patient.identifier?.some(id => id.value.toLowerCase() === String(dto.patientId).toLowerCase()));
        }
        if (!patient) {
            patient = samplePatients_1.SAMPLE_PATIENTS[0];
        }
        const protocol = sampleProtocols_1.SAMPLE_PROTOCOLS.find(p => p.id === dto?.protocolId || p.protocolNumber === dto?.protocolId || p.nctId === dto?.protocolId) || sampleProtocols_1.SAMPLE_PROTOCOLS[0];
        const evaluation = (0, criteriaEngine_1.evaluatePatientForTrial)(patient, protocol);
        return {
            success: true,
            timestamp: new Date().toISOString(),
            evaluation
        };
    }
    async parseProtocol(dto) {
        const raw = dto?.rawText || '';
        const extracted = (0, protocolParser_1.parseProtocolText)(raw);
        return {
            success: true,
            extractedCount: extracted.length,
            criteria: extracted,
            timestamp: new Date().toISOString()
        };
    }
};
exports.CriteriaService = CriteriaService;
exports.CriteriaService = CriteriaService = __decorate([
    (0, common_1.Injectable)()
], CriteriaService);
//# sourceMappingURL=criteria.service.js.map