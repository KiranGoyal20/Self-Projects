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
exports.CriteriaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const criteria_service_1 = require("./criteria.service");
const criteria_dto_1 = require("./criteria.dto");
let CriteriaController = class CriteriaController {
    criteriaService;
    constructor(criteriaService) {
        this.criteriaService = criteriaService;
    }
    async evaluateCriteria(dto) {
        return this.criteriaService.evaluate(dto);
    }
    async getSampleEvaluateCriteria() {
        return this.criteriaService.evaluate({});
    }
    async evaluateAlias(dto) {
        return this.criteriaService.evaluate(dto);
    }
    async getSampleEvaluateAlias() {
        return this.criteriaService.evaluate({});
    }
    async parseProtocol(dto) {
        return this.criteriaService.parseProtocol(dto);
    }
};
exports.CriteriaController = CriteriaController;
__decorate([
    (0, common_1.Post)('criteria/evaluate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate patient against clinical trial criteria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evaluation generated with traceable clinical evidence grounding' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criteria_dto_1.EvaluateCriteriaDto]),
    __metadata("design:returntype", Promise)
], CriteriaController.prototype, "evaluateCriteria", null);
__decorate([
    (0, common_1.Get)('criteria/evaluate'),
    (0, swagger_1.ApiOperation)({ summary: 'Sample evaluation (GET runner)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CriteriaController.prototype, "getSampleEvaluateCriteria", null);
__decorate([
    (0, common_1.Post)('evaluate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Evaluate patient against criteria (alias)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Evaluation generated with traceable clinical evidence grounding' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criteria_dto_1.EvaluateCriteriaDto]),
    __metadata("design:returntype", Promise)
], CriteriaController.prototype, "evaluateAlias", null);
__decorate([
    (0, common_1.Get)('evaluate'),
    (0, swagger_1.ApiOperation)({ summary: 'Sample evaluation (alias GET runner)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CriteriaController.prototype, "getSampleEvaluateAlias", null);
__decorate([
    (0, common_1.Post)('criteria/parse-protocol'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Parse unstructured protocol text into structured criteria rules' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Extracted structured criteria rules' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criteria_dto_1.ParseProtocolDto]),
    __metadata("design:returntype", Promise)
], CriteriaController.prototype, "parseProtocol", null);
exports.CriteriaController = CriteriaController = __decorate([
    (0, swagger_1.ApiTags)('Clinical Criteria Engine'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [criteria_service_1.CriteriaService])
], CriteriaController);
//# sourceMappingURL=criteria.controller.js.map