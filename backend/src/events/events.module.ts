import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { SponsorshipLevel } from './entities/sponsorship-level.entity';
import { SponsorshipLevelService } from './sponsorship-level.service';
import { SponsorshipLevelController } from './sponsorship-level.controller';
import { CategoryModule } from './category.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Event, SponsorshipLevel]),
    CategoryModule, // Import CategoryModule to provide CategoryService and repository
  ],
  controllers: [EventsController, SponsorshipLevelController],
  providers: [EventsService, SponsorshipLevelService],
  exports: [EventsService],
})
export class EventsModule {}
