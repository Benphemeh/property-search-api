import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesRepository } from './properties.repository';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesRepository],
  exports: [PropertiesRepository],
})
export class PropertiesModule {}
