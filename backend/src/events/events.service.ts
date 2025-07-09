import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Speaker } from "./entities/speaker.entity";
import { Sponsor } from "./entities/sponsor.entity";
import { Booth } from "./entities/booth.entity";
import { TicketType } from "./entities/ticket-type.entity";
import { EventDay } from "./entities/event-day.entity";

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
    // Load entity gốc cùng các quan hệ
    const event = await this.eventRepository.findOne({ where: { id }, relations: ['speakers', 'sponsors', 'booths', 'ticketTypes', 'days', 'days.activities'] });
    if (!event) return null;

    // Gán các trường primitive
    event.title = updateEventDto.title ?? event.title;
    event.description = updateEventDto.description ?? event.description;
    event.category = updateEventDto.category ?? event.category;
    event.location = updateEventDto.location ?? event.location;
    event.startDate = updateEventDto.startDate ?? event.startDate;
    event.endDate = updateEventDto.endDate ?? event.endDate;
    event.isFreeEvent = typeof updateEventDto.isFreeEvent === 'boolean' ? updateEventDto.isFreeEvent : event.isFreeEvent;
    event.media = updateEventDto.media ?? event.media;
    // Update tabConfig if provided
    event.tabConfig = updateEventDto.tabConfig ?? event.tabConfig;
    // Update eventType if provided
    event.eventType = updateEventDto.eventType ?? event.eventType;
    // Update ticketCategories if provided
    event.ticketCategories = updateEventDto.ticketCategories ?? event.ticketCategories;

    // Helper: convert DTO array to entity array, ép kiểu trả về đúng entity
    const toEntities = <T>(arr: any[], EntityClass: new () => T): T[] =>
      (arr || []).map((item) =>
        this.eventRepository.manager.create(EntityClass, item),
      ) as T[];

    // Gán lại các trường lồng nhau (nếu có)
    if (updateEventDto.speakers)
      event.speakers = toEntities<Speaker>(updateEventDto.speakers, Speaker);
    if (updateEventDto.sponsors)
      event.sponsors = toEntities<Sponsor>(updateEventDto.sponsors, Sponsor);
    if (updateEventDto.booths)
      event.booths = toEntities<Booth>(updateEventDto.booths, Booth);
    if (updateEventDto.ticketTypes)
      event.ticketTypes = toEntities<TicketType>(
        updateEventDto.ticketTypes,
        TicketType,
      );
    if (updateEventDto.days)
      event.days = toEntities<EventDay>(updateEventDto.days, EventDay);

    // Lưu lại entity đã merge
    await this.eventRepository.save(event);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
