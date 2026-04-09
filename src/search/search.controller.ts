import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('api')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Accepts a natural language query and returns matching properties
   */
  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search properties using a natural language query' })
  @ApiBody({ type: SearchQueryDto })
  @ApiOkResponse({ description: 'Matching properties returned successfully' })
  async search(@Body() dto: SearchQueryDto) {
    return this.searchService.search(dto.query);
  }
}
