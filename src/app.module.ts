import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from './llm/llm.module';
import { SearchModule } from './search/search.module';
import { PropertiesModule } from './properties/properties.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LlmModule,
    SearchModule,
    PropertiesModule,
    HealthModule,
  ],
})
export class AppModule {}
