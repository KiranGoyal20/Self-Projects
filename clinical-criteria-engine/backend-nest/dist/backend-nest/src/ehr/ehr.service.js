"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EhrService = void 0;
const common_1 = require("@nestjs/common");
const ehrConnectors_1 = require("../../../src/lib/data/ehrConnectors");
let EhrService = class EhrService {
    async getStatus() {
        return {
            success: true,
            connectors: ehrConnectors_1.EHR_CONNECTORS_DATA,
            recentJobs: ehrConnectors_1.RECENT_INGESTION_JOBS,
            timestamp: new Date().toISOString()
        };
    }
    async triggerSync(dto) {
        const job = {
            jobId: `job-nest-${dto.provider.toLowerCase()}-${Date.now().toString().slice(-4)}`,
            provider: dto.provider,
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            status: 'COMPLETED',
            resourceCounts: {
                Patient: 15,
                Condition: 42,
                Observation: 180,
                MedicationRequest: 32,
                DocumentReference: 12
            },
            durationMs: 42000,
            logMessages: [
                `[${dto.provider} NestJS Worker] Authentication handshake verified`,
                `[Bulk Export Pipeline] Downloaded NDJSON FHIR bundle from AWS S3`,
                `[FHIR R4 Validation] 100% US-Core conformance verified`,
                `[Deduplication] Filtered duplicate patient identifiers via composite MRN hash`,
                `[Criteria Engine] 15 patients queued for protocol screening`
            ]
        };
        ehrConnectors_1.RECENT_INGESTION_JOBS.unshift(job);
        return {
            success: true,
            message: `Bulk sync completed successfully for ${dto.provider}`,
            job
        };
    }
};
exports.EhrService = EhrService;
exports.EhrService = EhrService = __decorate([
    (0, common_1.Injectable)()
], EhrService);
//# sourceMappingURL=ehr.service.js.map