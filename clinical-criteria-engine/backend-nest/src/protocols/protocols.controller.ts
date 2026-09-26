import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './protocols.dto';

@ApiTags('Clinical Protocols & Criteria Studio')
@Controller('protocols')
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @Get()
  @ApiOperation({ summary: 'List all clinical trial protocols' })
  @ApiResponse({ status: 200, description: 'List of active trials with criteria rules' })
  async findAll() {
    return this.protocolsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trial protocol by ID' })
  @ApiParam({ name: 'id', example: 'trial-bond-001' })
  async findOne(@Param('id') id: string) {
    return this.protocolsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new clinical trial protocol' })
  @ApiResponse({ status: 201, description: 'Protocol created successfully' })
  async create(@Body() dto: CreateProtocolDto) {
    return this.protocolsService.create(dto);
  }
}
