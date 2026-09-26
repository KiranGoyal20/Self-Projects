"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolsService = void 0;
const common_1 = require("@nestjs/common");
const sampleProtocols_1 = require("../../../src/lib/data/sampleProtocols");
let ProtocolsService = class ProtocolsService {
    async findAll() {
        return {
            success: true,
            count: sampleProtocols_1.SAMPLE_PROTOCOLS.length,
            protocols: sampleProtocols_1.SAMPLE_PROTOCOLS
        };
    }
    async findOne(id) {
        const protocol = sampleProtocols_1.SAMPLE_PROTOCOLS.find(p => p.id === id);
        if (!protocol) {
            throw new common_1.NotFoundException(`Protocol "${id}" not found`);
        }
        return { success: true, protocol };
    }
    async create(dto) {
        const newProtocol = {
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
        sampleProtocols_1.SAMPLE_PROTOCOLS.push(newProtocol);
        return {
            success: true,
            message: 'Protocol created and registered for screening',
            protocol: newProtocol
        };
    }
};
exports.ProtocolsService = ProtocolsService;
exports.ProtocolsService = ProtocolsService = __decorate([
    (0, common_1.Injectable)()
], ProtocolsService);
//# sourceMappingURL=protocols.service.js.map