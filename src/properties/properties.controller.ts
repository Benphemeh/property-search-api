import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PropertiesRepository } from './properties.repository';

@ApiTags('properties')
@Controller('api/properties')
export class PropertiesController {
  constructor(private readonly propertiesRepository: PropertiesRepository) {}

  /**
   * Returns all properties with optional filtering
   */
  @Get()
  @ApiOperation({ summary: 'Get all properties with optional filters' })
  @ApiQuery({ name: 'site_type', required: false, description: 'Filter by site type' })
  @ApiQuery({ name: 'region', required: false, description: 'Filter by UK region' })
  async findAll(
    @Query('site_type') site_type?: string,
    @Query('region') region?: string,
  ) {
    const results = await this.propertiesRepository.findAll({ site_type, region });
    return { success: true, results, total: results.length };
  }

  /**
   * Returns a single property by UUID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single property by ID' })
  @ApiParam({ name: 'id', description: 'Property UUID' })
  async findOne(@Param('id') id: string) {
    const property = await this.propertiesRepository.findById(id);
    if (!property) throw new NotFoundException(`Property with id ${id} not found`);
    return { success: true, result: property };
  }
}
