"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Bond Health | Clinical Criteria Engine & EHR Integration API')
        .setDescription('NestJS 11 enterprise backend service for Bond Health platform: automated clinical criteria screening, FHIR R4 ingestion, protocol parsing, and EHR pipeline telemetry.')
        .setVersion('1.0')
        .addTag('Clinical Criteria Engine', 'Deterministic and semantic protocol eligibility evaluation')
        .addTag('FHIR R4 Patient Ingestion', 'Normalized patient records, labs, conditions, and clinical notes')
        .addTag('Clinical Protocols & Criteria Studio', 'Trial protocols, inclusion/exclusion rules, and NLP parsing')
        .addTag('EHR Interoperability Hub', 'Pipeline health and batch sync for Epic, athenahealth, eCW, and OncoEMR')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Bond Health API Docs (NestJS 11)',
    });
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`\n======================================================`);
    console.log(`🚀 Bond Health NestJS 11 Backend running on port ${port}`);
    console.log(`📚 OpenAPI / Swagger Docs at: http://localhost:${port}/api/docs`);
    console.log(`======================================================\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map