"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EhrModule = void 0;
const common_1 = require("@nestjs/common");
const ehr_controller_1 = require("./ehr.controller");
const ehr_service_1 = require("./ehr.service");
let EhrModule = class EhrModule {
};
exports.EhrModule = EhrModule;
exports.EhrModule = EhrModule = __decorate([
    (0, common_1.Module)({
        controllers: [ehr_controller_1.EhrController],
        providers: [ehr_service_1.EhrService],
        exports: [ehr_service_1.EhrService],
    })
], EhrModule);
//# sourceMappingURL=ehr.module.js.map