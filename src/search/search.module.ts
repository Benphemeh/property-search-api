import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { LlmModule } from '../llm/llm.module';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [LlmModule, PropertiesModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
