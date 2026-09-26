import { Controller, Get, Post, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { QueryPatientsDto, IngestFhirPatientDto } from './patients.dto';

@ApiTags('FHIR R4 Patient Ingestion')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ApiOperation({
    summary: 'Search and filter FHIR patients across EHR sources',
    description: 'Returns normalized FHIR R4 patients with conditions, observations, and clinical note counts.'
  })
  @ApiResponse({ status: 200, description: 'Filtered patient list' })
  async findAll(@Query() query: QueryPatientsDto) {
    return this.patientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get complete clinical record bundle for a patient' })
  @ApiParam({ name: 'id', example: 'p-001' })
  async findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  @Post('ingest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Ingest custom FHIR R4 patient bundle' })
  @ApiResponse({ status: 201, description: 'Patient record indexed successfully' })
  async ingest(@Body() dto: IngestFhirPatientDto) {
    return this.patientsService.ingest(dto);
  }
}
