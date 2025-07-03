import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabConfig } from './tab-config.entity';
import { TabConfigService } from './tab-config.service';
import { TabConfigController } from './tab-config.controller';
import { EventType } from './event-type.entity';
import { EventTypeService } from './event-type.service';
import { EventTypeController } from './event-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TabConfig, EventType])],
  controllers: [TabConfigController, EventTypeController],
  providers: [TabConfigService, EventTypeService],
  exports: [TabConfigService, EventTypeService],
})
export class TabConfigModule {}
