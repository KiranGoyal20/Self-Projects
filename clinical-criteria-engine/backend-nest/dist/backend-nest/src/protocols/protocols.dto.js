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
exports.CreateProtocolDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateProtocolDto {
    nctId;
    protocolNumber;
    title;
    shortTitle;
    indication;
    diseaseArea;
    phase;
    sponsor;
    principalInvestigator;
    targetEnrollment;
    criteria;
}
exports.CreateProtocolDto = CreateProtocolDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NCT05429188' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "nctId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BOND-LUNG-001' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "protocolNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phase 3 Study of Targeted Kinase Inhibitor in Advanced NSCLC' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phase III EGFR+ NSCLC' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "shortTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Non-Small Cell Lung Cancer' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "indication", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Oncology', enum: ['Oncology', 'Endocrinology', 'Immunology', 'Cardiology', 'Neurology'] }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "diseaseArea", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phase III', enum: ['Phase I', 'Phase I/II', 'Phase II', 'Phase III', 'Phase IV'] }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "phase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'AstraBiopharma / Bond Health Network' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "sponsor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dr. Aris Thorne, MD' }),
    __metadata("design:type", String)
], CreateProtocolDto.prototype, "principalInvestigator", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 120 }),
    __metadata("design:type", Number)
], CreateProtocolDto.prototype, "targetEnrollment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'List of inclusion and exclusion criteria rules' }),
    __metadata("design:type", Array)
], CreateProtocolDto.prototype, "criteria", void 0);
//# sourceMappingURL=protocols.dto.js.map