import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { CreateEventDto } from "../dto/create-event.dto";
import { UpdateEventDto } from "../dto/update-event.dto";
import { Speaker } from "../entities/speaker.entity";
import { Sponsor } from "../entities/sponsor.entity";
import { Booth } from "../entities/booth.entity";
import { TicketType } from "../entities/ticket-type.entity";
import { EventDay } from "../entities/event-day.entity";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Ensure location is never null
    if (!createEventDto.location) {
      createEventDto.location = {};
    }
    // Ensure ticketTypes[].name/description are always multilingual objects
    if (Array.isArray(createEventDto.ticketTypes)) {
      createEventDto.ticketTypes = createEventDto.ticketTypes.map((ticket) => {
        let name = ticket.name;
        let description = ticket.description;
        if (!name || typeof name !== "object") name = { en: "" };
        if (!description || typeof description !== "object")
          description = { en: "" };
        return { ...ticket, name, description };
      });
    }
    // Convert nested DTOs to entity objects
    const event = this.eventRepository.create({
      ...createEventDto,
      speakers: createEventDto.speakers?.map((s) => ({ ...s })) || [],
      sponsors: createEventDto.sponsors?.map((s) => ({ ...s })) || [],
      booths: createEventDto.booths?.map((b) => ({ ...b })) || [],
      ticketTypes: createEventDto.ticketTypes?.map((t) => ({ ...t })) || [],
      days: createEventDto.days?.map((d) => ({ ...d })) || [],
    } as any);
    const savedEvent = await this.eventRepository.save(event);
    // If save returns an array, pick the first element; otherwise, return as is
    return Array.isArray(savedEvent) ? savedEvent[0] : savedEvent;
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: { page: number; limit: number };
  }): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const { page, limit } = paginationOptions;
    const [data, total] = await this.eventRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
      relations: [
        "speakers",
        "sponsors",
        "booths",
        "ticketTypes",
        "days",
        "days.activities",
      ],
    });
    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: [
        "speakers",
        "sponsors",
        "booths",
        "ticketTypes",
        "days",
        "days.activities",
      ],
    });
    if (!event) return null;
    // Ensure ticketTypes[].name/description are always multilingual objects
    if (Array.isArray(event.ticketTypes)) {
      event.ticketTypes = event.ticketTypes.map((ticket) => {
        let name = ticket.name;
        let description = ticket.description;
        if (typeof name === "string") name = { en: name };
        if (!name || typeof name !== "object") name = { en: "" };
        if (typeof description === "string") description = { en: description };
        if (!description || typeof description !== "object")
          description = { en: "" };
        return { ...ticket, name, description };
      });
    }
    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event | null> {
    // Load entity gốc cùng các quan hệ
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: [
        "speakers",
        "sponsors",
        "booths",
        "ticketTypes",
        "days",
        "days.activities",
      ],
    });
    if (!event) return null;

    // Helper: ensure multilingual fields are always Record<string, string>
    const normalizeMultilingual = (
      val: any,
      fallback: Record<string, string>,
    ): Record<string, string> => {
      if (!val) return fallback;
      if (typeof val === "string") {
        // Default to 'en' if string provided
        return { en: val };
      }
      return val;
    };

    event.title = normalizeMultilingual(updateEventDto.title, event.title);
    event.description = normalizeMultilingual(
      updateEventDto.description,
      event.description,
    );
    event.category = updateEventDto.category ?? "";
    event.location = normalizeMultilingual(
      updateEventDto.location,
      event.location ?? {},
    );
    event.startDate = updateEventDto.startDate ?? event.startDate;
    event.endDate = updateEventDto.endDate ?? event.endDate;
    event.isFreeEvent =
      typeof updateEventDto.isFreeEvent === "boolean"
        ? updateEventDto.isFreeEvent
        : event.isFreeEvent;
    event.media = updateEventDto.media ?? event.media;
    // Update tabConfig if provided
    event.tabConfig = updateEventDto.tabConfig ?? event.tabConfig;
    // Update eventType if provided
    event.eventType = updateEventDto.eventType ?? event.eventType;
    // Update ticketCategories if provided
    event.ticketCategories =
      updateEventDto.ticketCategories ?? event.ticketCategories;
    event.title = normalizeMultilingual(updateEventDto.title, event.title);
    event.description = normalizeMultilingual(
      updateEventDto.description,
      event.description,
    );
    event.category = updateEventDto.category ?? "";
    event.location = normalizeMultilingual(
      updateEventDto.location,
      event.location ?? {},
    );
    event.startDate = updateEventDto.startDate ?? event.startDate;
    event.endDate = updateEventDto.endDate ?? event.endDate;
    event.isFreeEvent =
      typeof updateEventDto.isFreeEvent === "boolean"
        ? updateEventDto.isFreeEvent
        : event.isFreeEvent;
    event.media = updateEventDto.media ?? event.media;
    // Update tabConfig if provided
    event.tabConfig = updateEventDto.tabConfig ?? event.tabConfig;
    // Update eventType if provided
    event.eventType = updateEventDto.eventType ?? event.eventType;

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

  async resetEvents() {
    try {
      await this.eventRepository.manager.query('DELETE FROM sponsorship_levels');
      await this.eventRepository.manager.query('DELETE FROM event_days');
      await this.eventRepository.manager.query('DELETE FROM ticket_types');
      await this.eventRepository.manager.query('DELETE FROM booths');
      await this.eventRepository.manager.query('DELETE FROM sponsors');
      await this.eventRepository.manager.query('DELETE FROM speakers');
      await this.eventRepository.manager.query('DELETE FROM events');
      return { message: 'All event data and related records have been deleted.' };
    } catch (err) {
      return { error: 'Failed to reset events', detail: err?.message };
    }
  }

  async seedEvents() {
    const eventNames = [
      { vi: 'Sự kiện công nghệ 2025', en: 'Tech Event 2025' },
      { vi: 'Sự kiện âm nhạc hè 2025', en: 'Summer Music Festival 2025' },
      { vi: 'Pháo hoa Đà Nẵng', en: 'Danang Fireworks Festival' },
      { vi: 'Ngày hội khởi nghiệp', en: 'Startup Day' },
      { vi: 'Triển lãm nghệ thuật quốc tế', en: 'International Art Expo' },
      { vi: 'Hội thảo AI Việt Nam', en: 'Vietnam AI Conference' },
      { vi: 'Ngày hội sức khỏe cộng đồng', en: 'Community Health Day' },
      { vi: 'Lễ hội ẩm thực đường phố', en: 'Street Food Festival' },
      { vi: 'Hội chợ việc làm sinh viên', en: 'Student Job Fair' },
      { vi: 'Giải chạy vì môi trường', en: 'Run for Environment' },
      { vi: 'Hội sách mùa thu', en: 'Autumn Book Fair' },
      { vi: 'Lễ hội startup trẻ', en: 'Young Startup Festival' },
      { vi: 'Hội nghị blockchain Việt Nam', en: 'Vietnam Blockchain Summit' },
      { vi: 'Ngày hội giáo dục quốc tế', en: 'International Education Day' },
      { vi: 'Hội thảo kinh doanh số', en: 'Digital Business Workshop' },
      { vi: 'Lễ hội văn hóa truyền thống', en: 'Traditional Culture Festival' },
      { vi: 'Hội chợ nông sản sạch', en: 'Clean Agriculture Fair' },
      { vi: 'Hội nghị phát triển bền vững', en: 'Sustainable Development Conference' },
      { vi: 'Lễ hội cosplay Việt Nam', en: 'Vietnam Cosplay Festival' },
      { vi: 'Hội thảo y tế thông minh', en: 'Smart Healthcare Workshop' }
    ];
    const categories = ['Tech', 'Business', 'Education', 'Health', 'Art', 'Music', 'Startup', 'AI', 'Blockchain', 'Environment'];
    const events: CreateEventDto[] = [];
    for (let i = 1; i <= 100; i++) {
      const nameObj = eventNames[(i - 1) % eventNames.length];
      const cat = categories[i % categories.length];
      const speakers = Array.from({ length: 2 }, (_, j) => ({
        name: { vi: `Diễn giả ${j + 1} cho ${nameObj.vi}`, en: `Speaker ${j + 1} for ${nameObj.en}` },
        title: { vi: `Chức danh ${j + 1}`, en: `Title ${j + 1}` },
        bio: { vi: `Tiểu sử diễn giả ${j + 1}`, en: `Bio of speaker ${j + 1}` },
        avatarUrl: '/placeholder.svg'
      }));
      const sponsors = Array.from({ length: 2 }, (_, j) => ({
        name: { vi: `Nhà tài trợ ${j + 1} cho ${nameObj.vi}`, en: `Sponsor ${j + 1} for ${nameObj.en}` },
        level: { vi: j === 0 ? 'Vàng' : 'Bạc', en: j === 0 ? 'Gold' : 'Silver' },
        website: `https://sponsor${j + 1}-${i}.com`,
        description: { vi: `Mô tả nhà tài trợ ${j + 1}`, en: `Description of sponsor ${j + 1}` },
        logoUrl: '/placeholder.svg'
      }));
      const booths = Array.from({ length: 2 }, (_, j) => ({
        name: { vi: `Gian hàng ${j + 1} cho ${nameObj.vi}`, en: `Booth ${j + 1} for ${nameObj.en}` },
        company: { vi: `Công ty ${j + 1}`, en: `Company ${j + 1}` },
        description: { vi: `Mô tả gian hàng ${j + 1}`, en: `Description of booth ${j + 1}` },
        location: { vi: `Khu vực ${j + 1}`, en: `Area ${j + 1}` },
        coverImageUrl: '/placeholder.svg'
      }));
      const ticketTypes = Array.from({ length: 2 }, (_, j) => ({
        name: { vi: `Vé ${j + 1}`, en: `Ticket ${j + 1}` },
        description: { vi: `Mô tả vé ${j + 1}`, en: `Description of ticket ${j + 1}` },
        price: 100000 * (j + 1),
        quantity: 100 * (j + 1)
      }));
      events.push({
        title: nameObj,
        description: { vi: `Sự kiện về chủ đề ${cat} với nhiều hoạt động hấp dẫn.`, en: `An event about ${cat} with many exciting activities.` },
        category: cat,
        location: { vi: `Địa điểm ${i}`, en: `Location ${i}` },
        startDate: `2025-08-${(i % 28 + 1).toString().padStart(2, '0')}`,
        endDate: `2025-08-${((i % 28 + 2) > 28 ? 1 : (i % 28 + 2)).toString().padStart(2, '0')}`,
        isFreeEvent: i % 2 === 0,
        media: [],
        coverImage: '',
        tabConfig: { info: true, schedule: true },
        eventType: cat,
        ticketCategories: ['Standard', 'VIP'],
        days: [],
        speakers,
        sponsors,
        booths,
        ticketTypes
      });
    }
    const eventEntities = events.map(dto =>
      this.eventRepository.create({
        ...dto,
        speakers: dto.speakers?.map(s => ({ ...s })) || [],
        sponsors: dto.sponsors?.map(s => ({ ...s })) || [],
        booths: dto.booths?.map(b => ({ ...b })) || [],
        ticketTypes: dto.ticketTypes?.map(t => ({ ...t })) || [],
        days: dto.days?.map(d => ({ ...d })) || [],
      } as any)
    );
    const flatEventEntities = eventEntities.flat();
    await this.eventRepository.save(flatEventEntities);
    return { message: 'Seeded 100 events successfully.' };
  }  
}
