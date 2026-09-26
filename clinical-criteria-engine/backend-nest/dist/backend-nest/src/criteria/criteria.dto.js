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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseProtocolDto = exports.EvaluateCriteriaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class EvaluateCriteriaDto {
    patientId;
    protocolId;
    patientRecord;
}
exports.EvaluateCriteriaDto = EvaluateCriteriaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'p-001', description: 'Patient ID from EHR database' }),
    __metadata("design:type", String)
], EvaluateCriteriaDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'trial-bond-001', description: 'Clinical Trial Protocol ID' }),
    __metadata("design:type", String)
], EvaluateCriteriaDto.prototype, "protocolId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Optional inline FHIR patient record bundle' }),
    __metadata("design:type", Object)
], EvaluateCriteriaDto.prototype, "patientRecord", void 0);
class ParseProtocolDto {
    rawText;
}
exports.ParseProtocolDto = ParseProtocolDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Inclusion Criteria:\n1. Adult patients aged 18 to 75 years.\n2. Histologically confirmed advanced NSCLC.\n3. ANC >= 1,500/uL.\n\nExclusion Criteria:\n1. Active CNS brain metastases.',
        description: 'Raw clinical trial protocol eligibility text'
    }),
    __metadata("design:type", String)
], ParseProtocolDto.prototype, "rawText", void 0);
//# sourceMappingURL=criteria.dto.js.map