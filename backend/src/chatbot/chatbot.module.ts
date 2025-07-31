import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from './chatbot.controller';
import { Event } from '../events/entities/event.entity';
import { Speaker } from '../events/entities/speaker.entity';
import { TicketType } from '../events/entities/ticket-type.entity';
import { Booth } from '../events/entities/booth.entity';
import { EventDay } from '../events/entities/event-day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Speaker, TicketType, Booth, EventDay])],
  controllers: [ChatbotController],
})
export class ChatbotModule {}
