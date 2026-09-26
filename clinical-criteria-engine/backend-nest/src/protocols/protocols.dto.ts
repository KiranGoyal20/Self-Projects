import { ApiProperty } from '@nestjs/swagger';

export class CreateProtocolDto {
  @ApiProperty({ example: 'NCT05429188' })
  nctId: string;

  @ApiProperty({ example: 'BOND-LUNG-001' })
  protocolNumber: string;

  @ApiProperty({ example: 'Phase 3 Study of Targeted Kinase Inhibitor in Advanced NSCLC' })
  title: string;

  @ApiProperty({ example: 'Phase III EGFR+ NSCLC' })
  shortTitle: string;

  @ApiProperty({ example: 'Non-Small Cell Lung Cancer' })
  indication: string;

  @ApiProperty({ example: 'Oncology', enum: ['Oncology', 'Endocrinology', 'Immunology', 'Cardiology', 'Neurology'] })
  diseaseArea: 'Oncology' | 'Endocrinology' | 'Immunology' | 'Cardiology' | 'Neurology';

  @ApiProperty({ example: 'Phase III', enum: ['Phase I', 'Phase I/II', 'Phase II', 'Phase III', 'Phase IV'] })
  phase: 'Phase I' | 'Phase I/II' | 'Phase II' | 'Phase III' | 'Phase IV';

  @ApiProperty({ example: 'AstraBiopharma / Bond Health Network' })
  sponsor: string;

  @ApiProperty({ example: 'Dr. Aris Thorne, MD' })
  principalInvestigator: string;

  @ApiProperty({ example: 120 })
  targetEnrollment: number;

  @ApiProperty({ description: 'List of inclusion and exclusion criteria rules' })
  criteria: any[];
}
