import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ICustomServiceInterface, CUSTOM_PORT_SERVICE, Result } from '@core';
import { FusionEntity } from '@infrastructure/entities/fusion.entity';

@Controller('customs')
@ApiResponse({ status: 401, description: 'No authorization token was found' })
@ApiResponse({ status: 500, description: 'Internal error' })
export class CustomsController {
  constructor(
    @Inject(CUSTOM_PORT_SERVICE)
    private readonly customServiceInterface: ICustomServiceInterface
  ) {}

  @ApiResponse({ description: "Find all fusions", isArray: true, type: FusionEntity })
  @ApiOperation({ summary: 'Find all fusions' })
  @Get('/fusion/:id')
  async findFusions(@Param('id') id: string): Promise<Result> {
    return await this.customServiceInterface.findFusion(id);
  }

  @ApiResponse({ description: "Create resouces" })
  @ApiOperation({ summary: 'Create resources' })
  @Post('/resources')
  async saveResources(@Body() data: any): Promise<Result> {
    return await this.customServiceInterface.saveResource(data);
  }

  @ApiResponse({ description: "Find all history fusions", isArray: true, type: FusionEntity })
  @ApiOperation({ summary: 'Find all history fusions' })
  @ApiQuery({ name: 'page', type: 'string', required: true })
  @ApiQuery({ name: 'limit', type: 'string', required: true })
  @Get('/history')
  async findHistories(@Query() query): Promise<Result> {
    const { page, limit } = query;
    return await this.customServiceInterface.findHistory(page, limit);
  }
}
