import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabConfig } from './tab-config.entity';
import { TabConfigService } from './tab-config.service';
import { TabConfigController } from './tab-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TabConfig])],
  providers: [TabConfigService],
  controllers: [TabConfigController],
  exports: [TabConfigService],
})
export class TabConfigModule {}
