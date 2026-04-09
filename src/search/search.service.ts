import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { PropertiesRepository } from '../properties/properties.repository';
import { SearchResponse } from '../types';

@Injectable()
export class SearchService {
  constructor(
    private readonly llmService: LlmService,
    private readonly propertiesRepository: PropertiesRepository,
  ) {}

  /**
   * Parses a natural language query with OpenAI then queries the database
   */
  async search(query: string): Promise<SearchResponse> {
    const start = Date.now();
    const parsed_criteria = await this.llmService.parseQuery(query);
    const results = await this.propertiesRepository.search(parsed_criteria);

    return {
      success: true,
      query,
      parsed_criteria,
      results,
      total: results.length,
      processing_time_ms: Date.now() - start,
    };
  }
}
