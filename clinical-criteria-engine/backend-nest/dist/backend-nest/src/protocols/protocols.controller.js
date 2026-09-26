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
exports.ProtocolsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const protocols_service_1 = require("./protocols.service");
const protocols_dto_1 = require("./protocols.dto");
let ProtocolsController = class ProtocolsController {
    protocolsService;
    constructor(protocolsService) {
        this.protocolsService = protocolsService;
    }
    async findAll() {
        return this.protocolsService.findAll();
    }
    async findOne(id) {
        return this.protocolsService.findOne(id);
    }
    async create(dto) {
        return this.protocolsService.create(dto);
    }
};
exports.ProtocolsController = ProtocolsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all clinical trial protocols' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active trials with criteria rules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trial protocol by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', example: 'trial-bond-001' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new clinical trial protocol' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Protocol created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [protocols_dto_1.CreateProtocolDto]),
    __metadata("design:returntype", Promise)
], ProtocolsController.prototype, "create", null);
exports.ProtocolsController = ProtocolsController = __decorate([
    (0, swagger_1.ApiTags)('Clinical Protocols & Criteria Studio'),
    (0, common_1.Controller)('protocols'),
    __metadata("design:paramtypes", [protocols_service_1.ProtocolsService])
], ProtocolsController);
//# sourceMappingURL=protocols.controller.js.map