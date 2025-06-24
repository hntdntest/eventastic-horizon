import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto as any);
    const savedEvent = await this.eventRepository.save(event);
    // If save returns an array, pick the first element; otherwise, return as is
    return Array.isArray(savedEvent) ? savedEvent[0] : savedEvent;
  }

  async findAllWithPagination({ paginationOptions }: { paginationOptions: { page: number; limit: number } }): Promise<Event[]> {
    const { page, limit } = paginationOptions;
    return this.eventRepository.find({ skip: (page - 1) * limit, take: limit, relations: ['speakers', 'sponsors', 'booths', 'ticketTypes', 'days', 'days.activities'] });
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventRepository.findOne({ where: { id }, relations: ['speakers', 'sponsors', 'booths', 'ticketTypes', 'days', 'days.activities'] });
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event | null> {
    await this.eventRepository.update(id, updateEventDto as any);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
