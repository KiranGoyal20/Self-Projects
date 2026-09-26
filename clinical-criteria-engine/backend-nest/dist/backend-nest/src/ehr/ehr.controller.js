"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EhrController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ehr_service_1 = require("./ehr.service");
const ehr_dto_1 = require("./ehr.dto");
let EhrController = class EhrController {
    ehrService;
    constructor(ehrService) {
        this.ehrService = ehrService;
    }
    async getStatus() {
        return this.ehrService.getStatus();
    }
    async triggerSync(dto) {
        return this.ehrService.triggerSync(dto);
    }
};
exports.EhrController = EhrController;
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get live telemetry and status for all connected EHR providers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'EHR connector health, rate limits, token countdowns' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EhrController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)('sync'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger batch ingestion sync for an EHR provider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ingestion job execution status' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ehr_dto_1.TriggerSyncDto]),
    __metadata("design:returntype", Promise)
], EhrController.prototype, "triggerSync", null);
exports.EhrController = EhrController = __decorate([
    (0, swagger_1.ApiTags)('EHR Interoperability Hub'),
    (0, common_1.Controller)('ehr'),
    __metadata("design:paramtypes", [ehr_service_1.EhrService])
], EhrController);
//# sourceMappingURL=ehr.controller.js.map