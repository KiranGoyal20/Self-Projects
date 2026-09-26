import { ApiProperty } from '@nestjs/swagger';

export class TriggerSyncDto {
  @ApiProperty({ example: 'Epic', enum: ['Epic', 'athenahealth', 'eClinicalWorks', 'OncoEMR'] })
  provider: 'Epic' | 'athenahealth' | 'eClinicalWorks' | 'OncoEMR';
}
