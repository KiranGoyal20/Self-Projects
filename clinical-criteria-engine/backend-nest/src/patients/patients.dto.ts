import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class QueryPatientsDto {
  @ApiPropertyOptional({ example: 'Epic', description: 'Filter by EHR provider source' })
  ehrSource?: string;

  @ApiPropertyOptional({ example: 'MRN-784920', description: 'Search by medical record number' })
  mrn?: string;

  @ApiPropertyOptional({ example: 'Eleanor', description: 'Search by patient name or keyword' })
  query?: string;
}

export class IngestFhirPatientDto {
  @ApiProperty({ description: 'FHIR R4 Patient Resource' })
  patient: any;

  @ApiPropertyOptional({ description: 'Array of FHIR Condition resources' })
  conditions?: any[];

  @ApiPropertyOptional({ description: 'Array of FHIR Observation resources' })
  observations?: any[];

  @ApiPropertyOptional({ description: 'Array of FHIR MedicationRequest resources' })
  medications?: any[];

  @ApiPropertyOptional({ description: 'Array of FHIR DocumentReference resources' })
  documents?: any[];

  @ApiPropertyOptional({ example: 'Epic', description: 'Source EHR system' })
  ehrSource?: 'Epic' | 'athenahealth' | 'eClinicalWorks' | 'OncoEMR';
}
