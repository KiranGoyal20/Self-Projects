import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CriteriaService } from './criteria.service';
import { EvaluateCriteriaDto, ParseProtocolDto } from './criteria.dto';

@ApiTags('Clinical Criteria Engine')
@Controller()
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  @Post('criteria/evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Evaluate patient against clinical trial criteria' })
  @ApiResponse({ status: 200, description: 'Evaluation generated with traceable clinical evidence grounding' })
  async evaluateCriteria(@Body() dto: EvaluateCriteriaDto) {
    return this.criteriaService.evaluate(dto);
  }

  @Get('criteria/evaluate')
  @ApiOperation({ summary: 'Sample evaluation (GET runner)' })
  async getSampleEvaluateCriteria() {
    return this.criteriaService.evaluate({} as any);
  }

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Evaluate patient against criteria (alias)' })
  @ApiResponse({ status: 200, description: 'Evaluation generated with traceable clinical evidence grounding' })
  async evaluateAlias(@Body() dto: EvaluateCriteriaDto) {
    return this.criteriaService.evaluate(dto);
  }

  @Get('evaluate')
  @ApiOperation({ summary: 'Sample evaluation (alias GET runner)' })
  async getSampleEvaluateAlias() {
    return this.criteriaService.evaluate({} as any);
  }

  @Post('criteria/parse-protocol')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parse unstructured protocol text into structured criteria rules' })
  @ApiResponse({ status: 200, description: 'Extracted structured criteria rules' })
  async parseProtocol(@Body() dto: ParseProtocolDto) {
    return this.criteriaService.parseProtocol(dto);
  }
}
