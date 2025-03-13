import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PersonEntity } from '../../entities/person.entity';
import { JwtAuthGuard } from '@infrastructure/common/guards/auth.guard';
import { IPersonServiceInterface, PERSON_PORT_SERVICE, Result } from '@core';
import { CreatedPersonDto, CreatePersonDto, UpdatePersonDto } from '@infrastructure/entities/dtos/person/person.dto';

@Controller('persons')
@ApiResponse({ status: 401, description: 'No authorization token was found' })
@ApiResponse({ status: 500, description: 'Internal error' })
export class PersonsController {
  constructor(
    @Inject(PERSON_PORT_SERVICE)
    private readonly personServiceInterface: IPersonServiceInterface
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ description: "Find all persons", isArray: true, type: PersonEntity })
  @ApiOperation({ summary: 'Find all persons' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Result> {
    return await this.personServiceInterface.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Find persons", type: PersonEntity })
  @ApiOperation({ summary: 'Find persons' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Result> {
    return await this.personServiceInterface.findOne(id);
  }

  @ApiResponse({ description: "Create person", type: CreatedPersonDto })
  @ApiOperation({ summary: 'Create person' })
  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    return await this.personServiceInterface.create(createPersonDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Update person", type: UpdatePersonDto })
  @ApiOperation({ summary: 'Update person' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return await this.personServiceInterface.update(id, updatePersonDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Delete person", type: String })
  @ApiOperation({ summary: 'Delete person' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.personServiceInterface.delete(id);
  }
}
