import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger OpenAPI 3.1 Setup
  const config = new DocumentBuilder()
    .setTitle('Bond Health | Clinical Criteria Engine & EHR Integration API')
    .setDescription(
      'NestJS 11 enterprise backend service for Bond Health platform: automated clinical criteria screening, FHIR R4 ingestion, protocol parsing, and EHR pipeline telemetry.'
    )
    .setVersion('1.0')
    .addTag('Clinical Criteria Engine', 'Deterministic and semantic protocol eligibility evaluation')
    .addTag('FHIR R4 Patient Ingestion', 'Normalized patient records, labs, conditions, and clinical notes')
    .addTag('Clinical Protocols & Criteria Studio', 'Trial protocols, inclusion/exclusion rules, and NLP parsing')
    .addTag('EHR Interoperability Hub', 'Pipeline health and batch sync for Epic, athenahealth, eCW, and OncoEMR')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
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
