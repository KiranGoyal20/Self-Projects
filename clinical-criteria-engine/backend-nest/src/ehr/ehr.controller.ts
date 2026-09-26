import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EhrService } from './ehr.service';
import { TriggerSyncDto } from './ehr.dto';

@ApiTags('EHR Interoperability Hub')
@Controller('ehr')
export class EhrController {
  constructor(private readonly ehrService: EhrService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get live telemetry and status for all connected EHR providers' })
  @ApiResponse({ status: 200, description: 'EHR connector health, rate limits, token countdowns' })
  async getStatus() {
    return this.ehrService.getStatus();
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger batch ingestion sync for an EHR provider' })
  @ApiResponse({ status: 200, description: 'Ingestion job execution status' })
  async triggerSync(@Body() dto: TriggerSyncDto) {
    return this.ehrService.triggerSync(dto);
  }
}
