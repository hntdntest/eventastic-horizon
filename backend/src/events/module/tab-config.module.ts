import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TabConfig } from "../entities/tab-config.entity";
import { TabConfigService } from "../service/tab-config.service";
import { TabConfigController } from "../controller/tab-config.controller";
import { EventType } from "../entities/event-type.entity";
import { EventTypeService } from "../service/event-type.service";
import { EventTypeController } from "../controller/event-type.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TabConfig, EventType])],
  controllers: [TabConfigController, EventTypeController],
  providers: [TabConfigService, EventTypeService],
  exports: [TabConfigService, EventTypeService],
})
export class TabConfigModule {}
