import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EvaluateCriteriaDto {
  @ApiPropertyOptional({ example: 'p-001', description: 'Patient ID from EHR database' })
  patientId?: string;

  @ApiProperty({ example: 'trial-bond-001', description: 'Clinical Trial Protocol ID' })
  protocolId: string;

  @ApiPropertyOptional({ description: 'Optional inline FHIR patient record bundle' })
  patientRecord?: any;
}

export class ParseProtocolDto {
  @ApiProperty({
    example: 'Inclusion Criteria:\n1. Adult patients aged 18 to 75 years.\n2. Histologically confirmed advanced NSCLC.\n3. ANC >= 1,500/uL.\n\nExclusion Criteria:\n1. Active CNS brain metastases.',
    description: 'Raw clinical trial protocol eligibility text'
  })
  rawText: string;
}
