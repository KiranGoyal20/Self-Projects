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
exports.IngestFhirPatientDto = exports.QueryPatientsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class QueryPatientsDto {
    ehrSource;
    mrn;
    query;
}
exports.QueryPatientsDto = QueryPatientsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Epic', description: 'Filter by EHR provider source' }),
    __metadata("design:type", String)
], QueryPatientsDto.prototype, "ehrSource", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'MRN-784920', description: 'Search by medical record number' }),
    __metadata("design:type", String)
], QueryPatientsDto.prototype, "mrn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Eleanor', description: 'Search by patient name or keyword' }),
    __metadata("design:type", String)
], QueryPatientsDto.prototype, "query", void 0);
class IngestFhirPatientDto {
    patient;
    conditions;
    observations;
    medications;
    documents;
    ehrSource;
}
exports.IngestFhirPatientDto = IngestFhirPatientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FHIR R4 Patient Resource' }),
    __metadata("design:type", Object)
], IngestFhirPatientDto.prototype, "patient", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of FHIR Condition resources' }),
    __metadata("design:type", Array)
], IngestFhirPatientDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of FHIR Observation resources' }),
    __metadata("design:type", Array)
], IngestFhirPatientDto.prototype, "observations", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of FHIR MedicationRequest resources' }),
    __metadata("design:type", Array)
], IngestFhirPatientDto.prototype, "medications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Array of FHIR DocumentReference resources' }),
    __metadata("design:type", Array)
], IngestFhirPatientDto.prototype, "documents", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Epic', description: 'Source EHR system' }),
    __metadata("design:type", String)
], IngestFhirPatientDto.prototype, "ehrSource", void 0);
//# sourceMappingURL=patients.dto.js.map