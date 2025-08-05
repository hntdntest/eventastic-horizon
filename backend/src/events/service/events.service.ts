import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";
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
    search,
  }: {
    paginationOptions: { page: number; limit: number };
    search?: string;
  }): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const { page, limit } = paginationOptions;
    const qb = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.speakers', 'speakers')
      .leftJoinAndSelect('event.sponsors', 'sponsors')
      .leftJoinAndSelect('event.booths', 'booths')
      .leftJoinAndSelect('event.ticketTypes', 'ticketTypes')
      .leftJoinAndSelect('event.days', 'days')
      .leftJoinAndSelect('days.activities', 'activities')
      .orderBy('event.createdAt', 'DESC');

    if (search && search.trim()) {
      const s = `%${search.trim().toLowerCase()}%`;
      qb.andWhere(new Brackets(qb1 => {
        // Search in JSON string (all fields)
        qb1.orWhere(`LOWER(CAST(event.title AS CHAR)) LIKE :s`, { s });
        qb1.orWhere(`LOWER(CAST(event.description AS CHAR)) LIKE :s`, { s });
        qb1.orWhere(`LOWER(CAST(event.location AS CHAR)) LIKE :s`, { s });
        qb1.orWhere(`LOWER(CAST(event.category AS CHAR)) LIKE :s`, { s });
        // Search in common JSON keys (en, vi) for each field
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.title, '$.en'))) LIKE :s`, { s });
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.title, '$.vi'))) LIKE :s`, { s });
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.description, '$.en'))) LIKE :s`, { s });
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.description, '$.vi'))) LIKE :s`, { s });
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.location, '$.en'))) LIKE :s`, { s });
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.location, '$.vi'))) LIKE :s`, { s });
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.category, '$.en'))) LIKE :s`, { s });
        qb1.orWhere(`LOWER(JSON_UNQUOTE(JSON_EXTRACT(event.category, '$.vi'))) LIKE :s`, { s });
      }));
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    // Always return multilingual fields with fallback
    const ensureMultilingual = (val: any) => {
      if (!val) return { en: '' };
      if (typeof val === 'string') return { en: val };
      return val;
    };
    data.forEach(ev => {
      ev.title = ensureMultilingual(ev.title);
      ev.description = ensureMultilingual(ev.description);
      ev.category = ensureMultilingual(ev.category);
      ev.location = ensureMultilingual(ev.location);
      // Map coverImage to imageUrl for frontend compatibility
      if ((ev as any).coverImage && !(ev as any).imageUrl) {
        (ev as any).imageUrl = (ev as any).coverImage;
      }
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
    // Map coverImage to imageUrl for frontend compatibility
    if ((event as any).coverImage && !(event as any).imageUrl) {
      (event as any).imageUrl = (event as any).coverImage;
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
      { vi: 'Hội nghị Công nghệ Thông tin Việt Nam', en: 'Vietnam IT Conference' },
      { vi: 'Lễ hội Âm nhạc Quốc tế Hà Nội', en: 'Hanoi International Music Festival' },
      { vi: 'Ngày hội Sách Mùa Xuân', en: 'Spring Book Fair' },
      { vi: 'Hội chợ Việc làm Toàn quốc', en: 'National Job Fair' },
      { vi: 'Triển lãm Ô tô Việt Nam', en: 'Vietnam Motor Show' },
      { vi: 'Hội thảo Đầu tư Khởi nghiệp', en: 'Startup Investment Workshop' },
      { vi: 'Lễ hội Ẩm thực Đường phố Sài Gòn', en: 'Saigon Street Food Festival' },
      { vi: 'Hội nghị Blockchain Châu Á', en: 'Asia Blockchain Summit' },
      { vi: 'Ngày hội Sức khỏe Cộng đồng', en: 'Community Health Day' },
      { vi: 'Hội thảo Trí tuệ Nhân tạo Việt Nam', en: 'Vietnam AI Symposium' },
      { vi: 'Lễ hội Pháo hoa Quốc tế Đà Nẵng', en: 'Danang International Fireworks Festival' },
      { vi: 'Hội nghị Giáo dục Quốc tế', en: 'International Education Conference' },
      { vi: 'Hội chợ Nông sản Sạch', en: 'Clean Agriculture Fair' },
      { vi: 'Triển lãm Nghệ thuật Đương đại', en: 'Contemporary Art Expo' },
      { vi: 'Hội thảo Kinh doanh Số', en: 'Digital Business Workshop' },
      { vi: 'Lễ hội Văn hóa Truyền thống', en: 'Traditional Culture Festival' },
      { vi: 'Hội nghị Phát triển Bền vững', en: 'Sustainable Development Conference' },
      { vi: 'Lễ hội Cosplay Việt Nam', en: 'Vietnam Cosplay Festival' },
      { vi: 'Hội thảo Y tế Thông minh', en: 'Smart Healthcare Workshop' },
      { vi: 'Hội nghị Lãnh đạo Trẻ', en: 'Young Leaders Summit' },
      { vi: 'Ngày hội Việc làm Sinh viên', en: 'Student Job Day' },
      { vi: 'Hội thảo Marketing Số', en: 'Digital Marketing Seminar' },
      { vi: 'Lễ hội Sáng tạo Trẻ', en: 'Youth Innovation Festival' },
      { vi: 'Hội nghị Khoa học Kỹ thuật', en: 'Science & Engineering Conference' },
      { vi: 'Triển lãm Công nghệ Xanh', en: 'Green Tech Expo' },
      { vi: 'Hội thảo Quản trị Doanh nghiệp', en: 'Corporate Management Workshop' },
      { vi: 'Lễ hội Thời trang Quốc tế', en: 'International Fashion Festival' },
      { vi: 'Hội nghị Du lịch Việt Nam', en: 'Vietnam Tourism Summit' },
      { vi: 'Ngày hội Thể thao Sinh viên', en: 'Student Sports Day' },
      { vi: 'Hội thảo Phát triển Bản thân', en: 'Personal Development Workshop' },
      { vi: 'Lễ hội Đèn lồng Hội An', en: 'Hoi An Lantern Festival' },
      { vi: 'Hội nghị Công nghệ Tài chính', en: 'Fintech Conference' },
      { vi: 'Triển lãm Sách Quốc tế', en: 'International Book Expo' },
      { vi: 'Hội thảo Lãnh đạo Nữ', en: 'Women Leadership Workshop' },
      { vi: 'Lễ hội Bia Quốc tế', en: 'International Beer Festival' },
      { vi: 'Hội nghị Đổi mới Sáng tạo', en: 'Innovation Summit' },
      { vi: 'Ngày hội Kết nối Doanh nghiệp', en: 'Business Networking Day' },
      { vi: 'Hội thảo Công nghệ Sinh học', en: 'Biotech Workshop' },
      { vi: 'Triển lãm Mỹ thuật Việt Nam', en: 'Vietnam Fine Arts Exhibition' },
      { vi: 'Hội nghị Kinh tế Toàn cầu', en: 'Global Economic Forum' },
      { vi: 'Lễ hội Trà Thái Nguyên', en: 'Thai Nguyen Tea Festival' },
      { vi: 'Hội thảo Quản lý Dự án', en: 'Project Management Seminar' },
      { vi: 'Triển lãm Công nghiệp 4.0', en: 'Industry 4.0 Expo' },
      { vi: 'Hội nghị Năng lượng Tái tạo', en: 'Renewable Energy Conference' },
      { vi: 'Lễ hội Hoa Đà Lạt', en: 'Dalat Flower Festival' },
      { vi: 'Hội thảo Kỹ năng Mềm', en: 'Soft Skills Workshop' },
      { vi: 'Triển lãm Du lịch Quốc tế', en: 'International Travel Expo' },
      { vi: 'Hội nghị Công nghệ Thực phẩm', en: 'Food Technology Conference' },
      { vi: 'Lễ hội Bóng đá Trẻ', en: 'Youth Football Festival' },
      { vi: 'Hội thảo Đào tạo Nhân sự', en: 'HR Training Workshop' },
      { vi: 'Triển lãm Đồ uống Việt Nam', en: 'Vietnam Beverage Expo' },
      { vi: 'Hội nghị Công nghệ Môi trường', en: 'Environmental Tech Summit' },
      { vi: 'Lễ hội Đua thuyền Hạ Long', en: 'Ha Long Boat Racing Festival' },
      { vi: 'Hội thảo Quản lý Thời gian', en: 'Time Management Workshop' },
      { vi: 'Triển lãm Đồ chơi Trẻ em', en: 'Kids Toy Expo' },
      { vi: 'Hội nghị Công nghệ Di động', en: 'Mobile Tech Conference' },
      { vi: 'Lễ hội Đua xe Địa hình', en: 'Off-road Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Lãnh đạo', en: 'Leadership Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Thực tế ảo', en: 'Virtual Reality Expo' },
      { vi: 'Hội nghị Đầu tư Bất động sản', en: 'Real Estate Investment Summit' },
      { vi: 'Lễ hội Đèn Trung thu', en: 'Mid-Autumn Lantern Festival' },
      { vi: 'Hội thảo Kỹ năng Giao tiếp', en: 'Communication Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Ô tô', en: 'Automotive Tech Expo' },
      { vi: 'Hội nghị Công nghệ Giáo dục', en: 'EdTech Conference' },
      { vi: 'Lễ hội Bóng rổ Trẻ', en: 'Youth Basketball Festival' },
      { vi: 'Hội thảo Quản lý Tài chính', en: 'Financial Management Workshop' },
      { vi: 'Triển lãm Công nghệ Nông nghiệp', en: 'AgriTech Expo' },
      { vi: 'Hội nghị Công nghệ Thông minh', en: 'Smart Tech Summit' },
      { vi: 'Lễ hội Đua xe Đạp', en: 'Cycling Festival' },
      { vi: 'Hội thảo Kỹ năng Thuyết trình', en: 'Presentation Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Xây dựng', en: 'Construction Tech Expo' },
      { vi: 'Hội nghị Công nghệ Tài chính Châu Á', en: 'Asia Fintech Summit' },
      { vi: 'Lễ hội Đua ngựa Bắc Hà', en: 'Bac Ha Horse Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Đàm phán', en: 'Negotiation Skills Workshop' },
      { vi: 'Triển lãm Công nghệ In 3D', en: '3D Printing Expo' },
      { vi: 'Hội nghị Công nghệ Blockchain', en: 'Blockchain Technology Conference' },
      { vi: 'Lễ hội Đua thuyền Cà Mau', en: 'Ca Mau Boat Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Quản lý', en: 'Management Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Điện tử', en: 'Electronics Tech Expo' },
      { vi: 'Hội nghị Công nghệ Sinh học Quốc tế', en: 'International Biotech Conference' },
      { vi: 'Lễ hội Đua xe Công thức 1', en: 'Formula 1 Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Bán hàng', en: 'Sales Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Thông tin', en: 'IT Tech Expo' },
      { vi: 'Hội nghị Công nghệ Năng lượng', en: 'Energy Tech Conference' },
      { vi: 'Lễ hội Đua xe Mô tô', en: 'Motorbike Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Làm việc Nhóm', en: 'Teamwork Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Đèn LED', en: 'LED Tech Expo' },
      { vi: 'Hội nghị Công nghệ Thực phẩm Quốc tế', en: 'International FoodTech Conference' },
      { vi: 'Lễ hội Đua thuyền Truyền thống', en: 'Traditional Boat Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Quản lý Dự án', en: 'Project Management Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Robot', en: 'Robotics Expo' },
      { vi: 'Hội nghị Công nghệ Thông tin Châu Á', en: 'Asia IT Conference' },
      { vi: 'Lễ hội Đua xe Đạp Địa hình', en: 'Mountain Bike Festival' },
      { vi: 'Hội thảo Kỹ năng Sáng tạo', en: 'Creative Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Môi trường', en: 'Environmental Tech Expo' },
      { vi: 'Hội nghị Công nghệ Giáo dục Quốc tế', en: 'International EdTech Conference' },
      { vi: 'Lễ hội Đua thuyền Quốc tế', en: 'International Boat Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Lập trình', en: 'Programming Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Thực phẩm Việt Nam', en: 'Vietnam FoodTech Expo' },
      { vi: 'Hội nghị Công nghệ Blockchain Quốc tế', en: 'International Blockchain Conference' },
      { vi: 'Lễ hội Đua xe Địa hình Quốc tế', en: 'International Off-road Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Quản lý Thời gian', en: 'Time Management Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Thực tế ảo Quốc tế', en: 'International VR Expo' },
      { vi: 'Hội nghị Công nghệ Nông nghiệp Quốc tế', en: 'International AgriTech Conference' },
      { vi: 'Lễ hội Đua xe Công thức 1 Quốc tế', en: 'International Formula 1 Festival' },
      { vi: 'Hội thảo Kỹ năng Lãnh đạo Quốc tế', en: 'International Leadership Workshop' },
      { vi: 'Triển lãm Công nghệ Điện tử Quốc tế', en: 'International Electronics Expo' },
      { vi: 'Hội nghị Công nghệ Sinh học Việt Nam', en: 'Vietnam Biotech Conference' },
      { vi: 'Lễ hội Đua thuyền Việt Nam', en: 'Vietnam Boat Racing Festival' },
      { vi: 'Hội thảo Kỹ năng Bán hàng Quốc tế', en: 'International Sales Skills Workshop' },
      { vi: 'Triển lãm Công nghệ Thông tin Việt Nam', en: 'Vietnam IT Expo' },
      { vi: 'Hội nghị Công nghệ Năng lượng Quốc tế', en: 'International Energy Tech Conference' },
      { vi: 'Lễ hội Đua xe Mô tô Quốc tế', en: 'International Motorbike Festival' }
    ];
    const categories = ['Tech', 'Business', 'Education', 'Health', 'Art', 'Music', 'Startup', 'AI', 'Blockchain', 'Environment'];
    const events: CreateEventDto[] = [];
    // 50 unique speakers
    const speakerPool = [
      { name: { vi: 'Nguyễn Văn An', en: 'An Nguyen' }, title: { vi: 'Giám đốc Công nghệ', en: 'Chief Technology Officer' }, bio: { vi: 'Chuyên gia công nghệ với hơn 15 năm kinh nghiệm trong lĩnh vực phần mềm.', en: 'Technology expert with over 15 years of experience in software.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Trần Thị Bình', en: 'Binh Tran' }, title: { vi: 'Nhà sáng lập Startup', en: 'Startup Founder' }, bio: { vi: 'Đã xây dựng nhiều dự án khởi nghiệp thành công tại Việt Nam.', en: 'Has built many successful startups in Vietnam.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lê Quốc Cường', en: 'Cuong Le' }, title: { vi: 'Chuyên gia Blockchain', en: 'Blockchain Specialist' }, bio: { vi: 'Diễn giả nổi tiếng về công nghệ blockchain và tiền mã hóa.', en: 'Famous speaker on blockchain and cryptocurrency.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phạm Minh Dũng', en: 'Dung Pham' }, title: { vi: 'Nhà nghiên cứu AI', en: 'AI Researcher' }, bio: { vi: 'Tiến sĩ trí tuệ nhân tạo, từng làm việc tại các viện nghiên cứu lớn.', en: 'PhD in AI, formerly at major research institutes.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Vũ Thị Hạnh', en: 'Hanh Vu' }, title: { vi: 'Chuyên gia Marketing', en: 'Marketing Expert' }, bio: { vi: 'Đã tư vấn chiến lược marketing cho nhiều thương hiệu lớn.', en: 'Has advised marketing strategies for many big brands.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Đỗ Văn Hòa', en: 'Hoa Do' }, title: { vi: 'Giám đốc Sản phẩm', en: 'Product Director' }, bio: { vi: 'Quản lý phát triển sản phẩm tại các công ty công nghệ hàng đầu.', en: 'Product development manager at leading tech companies.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Ngô Thị Lan', en: 'Lan Ngo' }, title: { vi: 'Chuyên gia Giáo dục', en: 'Education Specialist' }, bio: { vi: 'Có nhiều năm kinh nghiệm trong lĩnh vực giáo dục và đào tạo.', en: 'Many years of experience in education and training.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Bùi Quang Minh', en: 'Minh Bui' }, title: { vi: 'Nhà đầu tư', en: 'Investor' }, bio: { vi: 'Đầu tư vào hơn 20 startup công nghệ tại Đông Nam Á.', en: 'Invested in over 20 tech startups in Southeast Asia.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phan Thị Mỹ', en: 'My Phan' }, title: { vi: 'Chuyên gia Nhân sự', en: 'HR Specialist' }, bio: { vi: 'Tư vấn tuyển dụng và phát triển nhân sự cho các tập đoàn lớn.', en: 'HR consultant for major corporations.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lý Văn Nam', en: 'Nam Ly' }, title: { vi: 'Giám đốc Điều hành', en: 'CEO' }, bio: { vi: 'Lãnh đạo doanh nghiệp với tầm nhìn chiến lược.', en: 'Business leader with strategic vision.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Trịnh Thị Oanh', en: 'Oanh Trinh' }, title: { vi: 'Chuyên gia Phát triển Bền vững', en: 'Sustainability Expert' }, bio: { vi: 'Tham gia nhiều dự án phát triển bền vững quốc tế.', en: 'Involved in many international sustainability projects.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Đặng Quốc Phong', en: 'Phong Dang' }, title: { vi: 'Nhà báo Công nghệ', en: 'Tech Journalist' }, bio: { vi: 'Phóng viên kỳ cựu về công nghệ và đổi mới sáng tạo.', en: 'Veteran reporter on technology and innovation.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Nguyễn Thị Quỳnh', en: 'Quynh Nguyen' }, title: { vi: 'Chuyên gia Tài chính', en: 'Finance Expert' }, bio: { vi: 'Tư vấn tài chính cho các doanh nghiệp vừa và nhỏ.', en: 'Financial advisor for SMEs.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lâm Văn Sơn', en: 'Son Lam' }, title: { vi: 'Nhà sáng lập EdTech', en: 'EdTech Founder' }, bio: { vi: 'Sáng lập nền tảng giáo dục trực tuyến nổi tiếng.', en: 'Founder of a popular online education platform.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Hoàng Thị Trang', en: 'Trang Hoang' }, title: { vi: 'Chuyên gia Pháp lý', en: 'Legal Expert' }, bio: { vi: 'Luật sư tư vấn cho các dự án công nghệ.', en: 'Legal advisor for tech projects.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phạm Văn Tuấn', en: 'Tuan Pham' }, title: { vi: 'Chuyên gia IoT', en: 'IoT Specialist' }, bio: { vi: 'Nghiên cứu và phát triển các giải pháp IoT cho doanh nghiệp.', en: 'Researches and develops IoT solutions for businesses.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Nguyễn Thị Uyên', en: 'Uyen Nguyen' }, title: { vi: 'Chuyên gia Phân tích Dữ liệu', en: 'Data Analyst' }, bio: { vi: 'Phân tích dữ liệu lớn cho các dự án tài chính.', en: 'Big data analyst for financial projects.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Võ Quang Vinh', en: 'Vinh Vo' }, title: { vi: 'Chuyên gia An ninh mạng', en: 'Cybersecurity Expert' }, bio: { vi: 'Tư vấn bảo mật cho các hệ thống ngân hàng.', en: 'Security consultant for banking systems.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Đỗ Thị Xuân', en: 'Xuan Do' }, title: { vi: 'Chuyên gia Đổi mới Sáng tạo', en: 'Innovation Expert' }, bio: { vi: 'Thúc đẩy đổi mới sáng tạo trong doanh nghiệp.', en: 'Drives innovation in enterprises.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Nguyễn Văn Yên', en: 'Yen Nguyen' }, title: { vi: 'Chuyên gia Quản trị Dự án', en: 'Project Management Expert' }, bio: { vi: 'Quản lý nhiều dự án lớn trong lĩnh vực công nghệ.', en: 'Managed many large tech projects.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Trần Thị Ánh', en: 'Anh Tran' }, title: { vi: 'Chuyên gia Đào tạo', en: 'Training Specialist' }, bio: { vi: 'Đào tạo kỹ năng mềm cho hàng nghìn học viên.', en: 'Soft skills trainer for thousands of learners.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lê Minh Bảo', en: 'Bao Le' }, title: { vi: 'Chuyên gia Quản lý Sản phẩm', en: 'Product Management Expert' }, bio: { vi: 'Tư vấn phát triển sản phẩm cho startup.', en: 'Product development consultant for startups.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phạm Thị Cúc', en: 'Cuc Pham' }, title: { vi: 'Chuyên gia Truyền thông', en: 'Media Specialist' }, bio: { vi: 'Xây dựng chiến lược truyền thông cho doanh nghiệp.', en: 'Builds media strategies for businesses.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Ngô Văn Duy', en: 'Duy Ngo' }, title: { vi: 'Chuyên gia Phát triển Ứng dụng', en: 'App Development Expert' }, bio: { vi: 'Phát triển nhiều ứng dụng di động thành công.', en: 'Developed many successful mobile apps.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Bùi Thị Em', en: 'Em Bui' }, title: { vi: 'Chuyên gia Quản lý Nhân sự', en: 'HR Management Expert' }, bio: { vi: 'Quản lý nhân sự tại các tập đoàn đa quốc gia.', en: 'HR manager at multinational corporations.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phan Văn Giang', en: 'Giang Phan' }, title: { vi: 'Chuyên gia Công nghệ Xanh', en: 'Green Tech Expert' }, bio: { vi: 'Thúc đẩy phát triển công nghệ xanh tại Việt Nam.', en: 'Promotes green technology in Vietnam.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lý Thị Hồng', en: 'Hong Ly' }, title: { vi: 'Chuyên gia Phát triển Kinh doanh', en: 'Business Development Expert' }, bio: { vi: 'Tư vấn phát triển kinh doanh cho doanh nghiệp vừa và nhỏ.', en: 'Business development consultant for SMEs.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Trịnh Văn Khoa', en: 'Khoa Trinh' }, title: { vi: 'Chuyên gia Quản lý Chuỗi cung ứng', en: 'Supply Chain Expert' }, bio: { vi: 'Tối ưu hóa chuỗi cung ứng cho các công ty sản xuất.', en: 'Optimizes supply chains for manufacturing companies.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Đặng Thị Lan', en: 'Lan Dang' }, title: { vi: 'Chuyên gia Đào tạo Lãnh đạo', en: 'Leadership Training Expert' }, bio: { vi: 'Đào tạo lãnh đạo cho các doanh nghiệp lớn.', en: 'Leadership trainer for large enterprises.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Nguyễn Văn Minh', en: 'Minh Nguyen' }, title: { vi: 'Chuyên gia Phát triển Phần mềm', en: 'Software Development Expert' }, bio: { vi: 'Phát triển phần mềm cho các dự án quốc tế.', en: 'Develops software for international projects.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Trần Thị Ngọc', en: 'Ngoc Tran' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng', en: 'Skills Training Expert' }, bio: { vi: 'Đào tạo kỹ năng nghề cho sinh viên.', en: 'Vocational skills trainer for students.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lê Văn Phúc', en: 'Phuc Le' }, title: { vi: 'Chuyên gia Quản lý Dự án CNTT', en: 'IT Project Management Expert' }, bio: { vi: 'Quản lý dự án CNTT cho các tập đoàn lớn.', en: 'IT project manager for large corporations.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phạm Thị Quỳnh', en: 'Quynh Pham' }, title: { vi: 'Chuyên gia Đào tạo Doanh nghiệp', en: 'Corporate Training Expert' }, bio: { vi: 'Đào tạo doanh nghiệp cho các công ty đa quốc gia.', en: 'Corporate trainer for multinational companies.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Ngô Văn Sơn', en: 'Son Ngo' }, title: { vi: 'Chuyên gia Công nghệ Môi trường', en: 'Environmental Tech Expert' }, bio: { vi: 'Nghiên cứu công nghệ môi trường tại các viện lớn.', en: 'Researches environmental technology at major institutes.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Bùi Thị Trang', en: 'Trang Bui' }, title: { vi: 'Chuyên gia Quản lý Sự kiện', en: 'Event Management Expert' }, bio: { vi: 'Tổ chức nhiều sự kiện lớn trong nước và quốc tế.', en: 'Organized many major domestic and international events.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phan Văn Út', en: 'Ut Phan' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng Sống', en: 'Life Skills Training Expert' }, bio: { vi: 'Đào tạo kỹ năng sống cho thanh thiếu niên.', en: 'Life skills trainer for youth.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lý Thị Vân', en: 'Van Ly' }, title: { vi: 'Chuyên gia Quản lý Tài chính', en: 'Financial Management Expert' }, bio: { vi: 'Tư vấn quản lý tài chính cá nhân và doanh nghiệp.', en: 'Personal and business finance consultant.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Trịnh Văn Xuân', en: 'Xuan Trinh' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng Lãnh đạo', en: 'Leadership Skills Trainer' }, bio: { vi: 'Đào tạo kỹ năng lãnh đạo cho sinh viên và doanh nghiệp.', en: 'Leadership skills trainer for students and businesses.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Đặng Thị Yến', en: 'Yen Dang' }, title: { vi: 'Chuyên gia Quản lý Thời gian', en: 'Time Management Expert' }, bio: { vi: 'Tư vấn quản lý thời gian hiệu quả cho cá nhân và tổ chức.', en: 'Time management consultant for individuals and organizations.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Nguyễn Văn Bình', en: 'Binh Nguyen' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng Giao tiếp', en: 'Communication Skills Trainer' }, bio: { vi: 'Đào tạo kỹ năng giao tiếp cho nhân viên văn phòng.', en: 'Communication skills trainer for office staff.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Trần Thị Cẩm', en: 'Cam Tran' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng Thuyết trình', en: 'Presentation Skills Trainer' }, bio: { vi: 'Đào tạo kỹ năng thuyết trình cho sinh viên và doanh nghiệp.', en: 'Presentation skills trainer for students and businesses.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Lê Văn Dũng', en: 'Dung Le' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng Đàm phán', en: 'Negotiation Skills Trainer' }, bio: { vi: 'Đào tạo kỹ năng đàm phán cho các nhà quản lý.', en: 'Negotiation skills trainer for managers.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Phạm Thị Hòa', en: 'Hoa Pham' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng Làm việc Nhóm', en: 'Teamwork Skills Trainer' }, bio: { vi: 'Đào tạo kỹ năng làm việc nhóm cho sinh viên.', en: 'Teamwork skills trainer for students.' }, avatarUrl: '/placeholder.svg' },
      { name: { vi: 'Ngô Văn Khoa', en: 'Khoa Ngo' }, title: { vi: 'Chuyên gia Đào tạo Kỹ năng Sáng tạo', en: 'Creative Skills Trainer' }, bio: { vi: 'Đào tạo kỹ năng sáng tạo cho doanh nghiệp.', en: 'Creative skills trainer for businesses.' }, avatarUrl: '/placeholder.svg' }
    ];
    for (let i = 1; i <= 100; i++) {
      const nameObj = eventNames[(i - 1) % eventNames.length];
      const cat = categories[i % categories.length];
      // Pick 2 unique speakers for each event
      const speaker1 = speakerPool[(i * 2 - 2) % speakerPool.length];
      const speaker2 = speakerPool[(i * 2 - 1) % speakerPool.length];
      const speakers = [speaker1, speaker2];
      // 50 unique sponsors
      const sponsorPool = [
        { name: { vi: 'Công ty Cổ phần FPT', en: 'FPT Corporation' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://fpt.com.vn', description: { vi: 'Tập đoàn công nghệ hàng đầu Việt Nam.', en: 'Leading technology corporation in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Ngân hàng Vietcombank', en: 'Vietcombank' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://vietcombank.com.vn', description: { vi: 'Ngân hàng thương mại lớn tại Việt Nam.', en: 'Major commercial bank in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Vingroup', en: 'Vingroup' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://vingroup.net', description: { vi: 'Tập đoàn đa ngành lớn nhất Việt Nam.', en: 'Vietnam’s largest multi-sector corporation.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty Vinamilk', en: 'Vinamilk' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://vinamilk.com.vn', description: { vi: 'Công ty sữa hàng đầu Việt Nam.', en: 'Leading dairy company in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Viettel', en: 'Viettel Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://viettel.com.vn', description: { vi: 'Tập đoàn viễn thông lớn nhất Việt Nam.', en: 'Largest telecom group in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Sữa TH', en: 'TH Milk JSC' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://thmilk.vn', description: { vi: 'Doanh nghiệp sản xuất sữa sạch nổi tiếng.', en: 'Famous clean milk producer.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Masan', en: 'Masan Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://masangroup.com', description: { vi: 'Tập đoàn tiêu dùng và thực phẩm lớn.', en: 'Major consumer and food group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP VNG', en: 'VNG Corporation' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://vng.com.vn', description: { vi: 'Công ty công nghệ và Internet hàng đầu.', en: 'Leading technology and internet company.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Sun Group', en: 'Sun Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://sungroup.com.vn', description: { vi: 'Tập đoàn đầu tư bất động sản và du lịch.', en: 'Real estate and tourism investment group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Tiki', en: 'Tiki Corporation' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://tiki.vn', description: { vi: 'Sàn thương mại điện tử lớn tại Việt Nam.', en: 'Major e-commerce platform in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Hòa Phát', en: 'Hoa Phat Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://hoaphat.com.vn', description: { vi: 'Tập đoàn sản xuất thép lớn nhất Việt Nam.', en: 'Largest steel manufacturer in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Momo', en: 'Momo JSC' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://momo.vn', description: { vi: 'Ví điện tử phổ biến tại Việt Nam.', en: 'Popular e-wallet in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Novaland', en: 'Novaland Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://novaland.com.vn', description: { vi: 'Tập đoàn bất động sản lớn.', en: 'Major real estate group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP PNJ', en: 'PNJ JSC' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://pnj.com.vn', description: { vi: 'Công ty trang sức hàng đầu Việt Nam.', en: 'Leading jewelry company in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Bảo Việt', en: 'Bao Viet Holdings' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://baoviet.com.vn', description: { vi: 'Tập đoàn bảo hiểm và tài chính lớn.', en: 'Major insurance and finance group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP FLC', en: 'FLC Group' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://flc.vn', description: { vi: 'Tập đoàn đầu tư đa ngành.', en: 'Multi-sector investment group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Đất Xanh', en: 'Dat Xanh Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://datxanh.vn', description: { vi: 'Tập đoàn bất động sản phát triển nhanh.', en: 'Fast-growing real estate group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Vinasoy', en: 'Vinasoy JSC' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://vinasoy.com.vn', description: { vi: 'Nhà sản xuất sữa đậu nành lớn.', en: 'Major soy milk producer.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Kido', en: 'Kido Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://kido.com.vn', description: { vi: 'Tập đoàn thực phẩm và đồ uống lớn.', en: 'Major food and beverage group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP VIB', en: 'VIB Bank' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://vib.com.vn', description: { vi: 'Ngân hàng thương mại cổ phần uy tín.', en: 'Prestigious joint-stock commercial bank.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Hưng Thịnh', en: 'Hung Thinh Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://hungthinhcorp.com.vn', description: { vi: 'Tập đoàn bất động sản lớn tại Việt Nam.', en: 'Major real estate group in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Biti’s', en: 'Biti’s JSC' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://bitis.com.vn', description: { vi: 'Thương hiệu giày dép nổi tiếng.', en: 'Famous footwear brand.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Nam Long', en: 'Nam Long Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://namlongvn.com', description: { vi: 'Tập đoàn phát triển nhà ở và đô thị.', en: 'Housing and urban development group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Nutifood', en: 'Nutifood JSC' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://nutifood.com.vn', description: { vi: 'Công ty dinh dưỡng hàng đầu.', en: 'Leading nutrition company.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Him Lam', en: 'Him Lam Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://himlam.com', description: { vi: 'Tập đoàn đầu tư bất động sản lớn.', en: 'Major real estate investment group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Kinh Đô', en: 'Kinh Do JSC' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://kinhdo.vn', description: { vi: 'Thương hiệu bánh kẹo nổi tiếng.', en: 'Famous confectionery brand.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn TTC', en: 'TTC Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://ttcgroup.vn', description: { vi: 'Tập đoàn đa ngành lớn tại Việt Nam.', en: 'Large multi-sector group in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Sài Gòn Food', en: 'Saigon Food JSC' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://sgfood.vn', description: { vi: 'Công ty thực phẩm chế biến lớn.', en: 'Major processed food company.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Sovico', en: 'Sovico Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://sovico.com.vn', description: { vi: 'Tập đoàn đầu tư tài chính và bất động sản.', en: 'Finance and real estate investment group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Dược Hậu Giang', en: 'DHG Pharma' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://dhgpharma.com.vn', description: { vi: 'Công ty dược phẩm lớn nhất Việt Nam.', en: 'Largest pharmaceutical company in Vietnam.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Geleximco', en: 'Geleximco Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://geleximco.com.vn', description: { vi: 'Tập đoàn đầu tư đa ngành lớn.', en: 'Large multi-sector investment group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Sữa Quốc tế', en: 'IDP JSC' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://idp.com.vn', description: { vi: 'Nhà sản xuất sữa và đồ uống lớn.', en: 'Major milk and beverage producer.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Bamboo Airways', en: 'Bamboo Airways' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://bambooairways.com.vn', description: { vi: 'Hãng hàng không phát triển nhanh.', en: 'Fast-growing airline.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Dược phẩm Imexpharm', en: 'Imexpharm JSC' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://imexpharm.com', description: { vi: 'Công ty dược phẩm uy tín.', en: 'Prestigious pharmaceutical company.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Thành Thành Công', en: 'Thanh Thanh Cong Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://ttcgroup.vn', description: { vi: 'Tập đoàn đa ngành lớn.', en: 'Large multi-sector group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Sữa Mộc Châu', en: 'Moc Chau Milk JSC' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://mocchaumilk.com', description: { vi: 'Nhà sản xuất sữa nổi tiếng.', en: 'Famous milk producer.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Lộc Trời', en: 'Loc Troi Group' }, level: { vi: 'Kim cương', en: 'Diamond' }, website: 'https://loctroi.vn', description: { vi: 'Tập đoàn nông nghiệp lớn.', en: 'Major agriculture group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Dược phẩm OPC', en: 'OPC Pharma JSC' }, level: { vi: 'Vàng', en: 'Gold' }, website: 'https://opcpharma.com', description: { vi: 'Công ty dược phẩm lâu đời.', en: 'Long-standing pharmaceutical company.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Tập đoàn Sao Mai', en: 'Sao Mai Group' }, level: { vi: 'Bạc', en: 'Silver' }, website: 'https://saomai.com.vn', description: { vi: 'Tập đoàn đa ngành phát triển nhanh.', en: 'Fast-growing multi-sector group.' }, logoUrl: '/placeholder.svg' },
        { name: { vi: 'Công ty CP Sữa Ba Vì', en: 'Ba Vi Milk JSC' }, level: { vi: 'Đồng', en: 'Bronze' }, website: 'https://bavimilk.vn', description: { vi: 'Nhà sản xuất sữa nổi tiếng miền Bắc.', en: 'Famous milk producer in the North.' }, logoUrl: '/placeholder.svg' }
      ];
      // Pick 2 unique sponsors for each event
      const sponsor1 = sponsorPool[(i * 2 - 2) % sponsorPool.length];
      const sponsor2 = sponsorPool[(i * 2 - 1) % sponsorPool.length];
      const sponsors = [sponsor1, sponsor2];
      // 50 unique booths
      const boothPool = [
        { name: { vi: 'Gian hàng Công nghệ FPT', en: 'FPT Tech Booth' }, company: { vi: 'FPT', en: 'FPT' }, description: { vi: 'Trưng bày các giải pháp công nghệ mới nhất của FPT.', en: 'Showcasing FPT’s latest tech solutions.' }, location: { vi: 'Khu A1', en: 'Zone A1' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Sữa Vinamilk', en: 'Vinamilk Dairy Booth' }, company: { vi: 'Vinamilk', en: 'Vinamilk' }, description: { vi: 'Giới thiệu các sản phẩm sữa mới.', en: 'Introducing new dairy products.' }, location: { vi: 'Khu B2', en: 'Zone B2' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đầu tư Vingroup', en: 'Vingroup Investment Booth' }, company: { vi: 'Vingroup', en: 'Vingroup' }, description: { vi: 'Thông tin về các dự án đầu tư bất động sản.', en: 'Information on real estate investment projects.' }, location: { vi: 'Khu C3', en: 'Zone C3' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Internet Viettel', en: 'Viettel Internet Booth' }, company: { vi: 'Viettel', en: 'Viettel' }, description: { vi: 'Trải nghiệm dịch vụ Internet tốc độ cao.', en: 'Experience high-speed Internet services.' }, location: { vi: 'Khu D4', en: 'Zone D4' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Thực phẩm Masan', en: 'Masan Food Booth' }, company: { vi: 'Masan', en: 'Masan' }, description: { vi: 'Thử các sản phẩm thực phẩm mới.', en: 'Taste new food products.' }, location: { vi: 'Khu E5', en: 'Zone E5' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Sữa TH', en: 'TH Milk Booth' }, company: { vi: 'TH Milk', en: 'TH Milk' }, description: { vi: 'Sữa sạch và các sản phẩm hữu cơ.', en: 'Clean milk and organic products.' }, location: { vi: 'Khu F6', en: 'Zone F6' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Nutifood', en: 'Nutifood Beverage Booth' }, company: { vi: 'Nutifood', en: 'Nutifood' }, description: { vi: 'Đồ uống dinh dưỡng cho mọi lứa tuổi.', en: 'Nutritional drinks for all ages.' }, location: { vi: 'Khu G7', en: 'Zone G7' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Trang sức PNJ', en: 'PNJ Jewelry Booth' }, company: { vi: 'PNJ', en: 'PNJ' }, description: { vi: 'Trang sức vàng, bạc, đá quý.', en: 'Gold, silver, and gemstone jewelry.' }, location: { vi: 'Khu H8', en: 'Zone H8' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Bánh kẹo Kinh Đô', en: 'Kinh Do Confectionery Booth' }, company: { vi: 'Kinh Đô', en: 'Kinh Do' }, description: { vi: 'Bánh kẹo truyền thống và hiện đại.', en: 'Traditional and modern confectionery.' }, location: { vi: 'Khu I9', en: 'Zone I9' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ chơi Trẻ em', en: 'Kids Toy Booth' }, company: { vi: 'ToysVN', en: 'ToysVN' }, description: { vi: 'Đồ chơi giáo dục và giải trí.', en: 'Educational and entertainment toys.' }, location: { vi: 'Khu J10', en: 'Zone J10' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Sách Fahasa', en: 'Fahasa Book Booth' }, company: { vi: 'Fahasa', en: 'Fahasa' }, description: { vi: 'Sách mới, sách thiếu nhi, sách ngoại văn.', en: 'New books, children’s books, foreign books.' }, location: { vi: 'Khu K11', en: 'Zone K11' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Thép Hòa Phát', en: 'Hoa Phat Steel Booth' }, company: { vi: 'Hoa Phat', en: 'Hoa Phat' }, description: { vi: 'Sản phẩm thép xây dựng chất lượng cao.', en: 'High-quality construction steel products.' }, location: { vi: 'Khu L12', en: 'Zone L12' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Sữa Ba Vì', en: 'Ba Vi Milk Booth' }, company: { vi: 'Ba Vi Milk', en: 'Ba Vi Milk' }, description: { vi: 'Sữa tươi nguyên chất từ Ba Vì.', en: 'Fresh milk from Ba Vi.' }, location: { vi: 'Khu M13', en: 'Zone M13' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đèn LED Rạng Đông', en: 'Rang Dong LED Booth' }, company: { vi: 'Rạng Đông', en: 'Rang Dong' }, description: { vi: 'Đèn LED tiết kiệm năng lượng.', en: 'Energy-saving LED lights.' }, location: { vi: 'Khu N14', en: 'Zone N14' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Bia Sài Gòn', en: 'Saigon Beer Booth' }, company: { vi: 'Sabeco', en: 'Sabeco' }, description: { vi: 'Các loại bia nổi tiếng của Việt Nam.', en: 'Famous Vietnamese beers.' }, location: { vi: 'Khu O15', en: 'Zone O15' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Pepsi', en: 'Pepsi Beverage Booth' }, company: { vi: 'Pepsi', en: 'Pepsi' }, description: { vi: 'Đồ uống giải khát quốc tế.', en: 'International soft drinks.' }, location: { vi: 'Khu P16', en: 'Zone P16' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Sữa Mộc Châu', en: 'Moc Chau Milk Booth' }, company: { vi: 'Moc Chau Milk', en: 'Moc Chau Milk' }, description: { vi: 'Sữa tươi và các sản phẩm từ sữa.', en: 'Fresh milk and dairy products.' }, location: { vi: 'Khu Q17', en: 'Zone Q17' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Coca-Cola', en: 'Coca-Cola Booth' }, company: { vi: 'Coca-Cola', en: 'Coca-Cola' }, description: { vi: 'Đồ uống giải khát nổi tiếng thế giới.', en: 'World-famous soft drinks.' }, location: { vi: 'Khu R18', en: 'Zone R18' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Công nghệ Samsung', en: 'Samsung Tech Booth' }, company: { vi: 'Samsung', en: 'Samsung' }, description: { vi: 'Thiết bị điện tử và công nghệ mới.', en: 'New electronics and technology devices.' }, location: { vi: 'Khu S19', en: 'Zone S19' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ gia dụng Panasonic', en: 'Panasonic Home Appliance Booth' }, company: { vi: 'Panasonic', en: 'Panasonic' }, description: { vi: 'Thiết bị gia dụng hiện đại.', en: 'Modern home appliances.' }, location: { vi: 'Khu T20', en: 'Zone T20' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Red Bull', en: 'Red Bull Booth' }, company: { vi: 'Red Bull', en: 'Red Bull' }, description: { vi: 'Nước tăng lực nổi tiếng.', en: 'Famous energy drink.' }, location: { vi: 'Khu U21', en: 'Zone U21' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Sách Kim Đồng', en: 'Kim Dong Book Booth' }, company: { vi: 'Kim Đồng', en: 'Kim Dong' }, description: { vi: 'Sách thiếu nhi và truyện tranh.', en: 'Children’s books and comics.' }, location: { vi: 'Khu V22', en: 'Zone V22' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Highlands', en: 'Highlands Coffee Booth' }, company: { vi: 'Highlands', en: 'Highlands' }, description: { vi: 'Cà phê và đồ uống đặc sản.', en: 'Coffee and specialty drinks.' }, location: { vi: 'Khu W23', en: 'Zone W23' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Trung Nguyên', en: 'Trung Nguyen Coffee Booth' }, company: { vi: 'Trung Nguyên', en: 'Trung Nguyen' }, description: { vi: 'Cà phê rang xay nổi tiếng.', en: 'Famous roasted coffee.' }, location: { vi: 'Khu X24', en: 'Zone X24' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Vinacafe', en: 'Vinacafe Booth' }, company: { vi: 'Vinacafe', en: 'Vinacafe' }, description: { vi: 'Cà phê hòa tan và đặc sản.', en: 'Instant and specialty coffee.' }, location: { vi: 'Khu Y25', en: 'Zone Y25' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Lavie', en: 'Lavie Water Booth' }, company: { vi: 'Lavie', en: 'Lavie' }, description: { vi: 'Nước khoáng thiên nhiên.', en: 'Natural mineral water.' }, location: { vi: 'Khu Z26', en: 'Zone Z26' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Aquafina', en: 'Aquafina Water Booth' }, company: { vi: 'Aquafina', en: 'Aquafina' }, description: { vi: 'Nước tinh khiết đóng chai.', en: 'Bottled purified water.' }, location: { vi: 'Khu A27', en: 'Zone A27' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Number 1', en: 'Number 1 Booth' }, company: { vi: 'Number 1', en: 'Number 1' }, description: { vi: 'Nước tăng lực và nước giải khát.', en: 'Energy and soft drinks.' }, location: { vi: 'Khu B28', en: 'Zone B28' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Tribeco', en: 'Tribeco Booth' }, company: { vi: 'Tribeco', en: 'Tribeco' }, description: { vi: 'Nước giải khát và nước ép trái cây.', en: 'Soft drinks and fruit juices.' }, location: { vi: 'Khu C29', en: 'Zone C29' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Wonderfarm', en: 'Wonderfarm Booth' }, company: { vi: 'Wonderfarm', en: 'Wonderfarm' }, description: { vi: 'Nước giải khát thảo mộc.', en: 'Herbal soft drinks.' }, location: { vi: 'Khu D30', en: 'Zone D30' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Yến sào Khánh Hòa', en: 'Khanh Hoa Bird’s Nest Booth' }, company: { vi: 'Yến sào Khánh Hòa', en: 'Khanh Hoa Bird’s Nest' }, description: { vi: 'Nước yến và sản phẩm yến sào.', en: 'Bird’s nest drinks and products.' }, location: { vi: 'Khu E31', en: 'Zone E31' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Sanna', en: 'Sanna Booth' }, company: { vi: 'Sanna', en: 'Sanna' }, description: { vi: 'Nước khoáng và nước giải khát.', en: 'Mineral water and soft drinks.' }, location: { vi: 'Khu F32', en: 'Zone F32' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Bidrico', en: 'Bidrico Booth' }, company: { vi: 'Bidrico', en: 'Bidrico' }, description: { vi: 'Nước giải khát và nước ép trái cây.', en: 'Soft drinks and fruit juices.' }, location: { vi: 'Khu G33', en: 'Zone G33' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Chương Dương', en: 'Chuong Duong Booth' }, company: { vi: 'Chương Dương', en: 'Chuong Duong' }, description: { vi: 'Nước ngọt truyền thống Việt Nam.', en: 'Traditional Vietnamese soft drinks.' }, location: { vi: 'Khu H34', en: 'Zone H34' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Sài Gòn', en: 'Saigon Beverage Booth' }, company: { vi: 'Sabeco', en: 'Sabeco' }, description: { vi: 'Đồ uống và bia Sài Gòn.', en: 'Saigon drinks and beer.' }, location: { vi: 'Khu I35', en: 'Zone I35' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Halico', en: 'Halico Booth' }, company: { vi: 'Halico', en: 'Halico' }, description: { vi: 'Rượu truyền thống Việt Nam.', en: 'Traditional Vietnamese liquor.' }, location: { vi: 'Khu J36', en: 'Zone J36' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Habeco', en: 'Habeco Booth' }, company: { vi: 'Habeco', en: 'Habeco' }, description: { vi: 'Bia Hà Nội và các sản phẩm liên quan.', en: 'Hanoi beer and related products.' }, location: { vi: 'Khu K37', en: 'Zone K37' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Sapporo', en: 'Sapporo Booth' }, company: { vi: 'Sapporo', en: 'Sapporo' }, description: { vi: 'Bia Sapporo nhập khẩu.', en: 'Imported Sapporo beer.' }, location: { vi: 'Khu L38', en: 'Zone L38' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Heineken', en: 'Heineken Booth' }, company: { vi: 'Heineken', en: 'Heineken' }, description: { vi: 'Bia Heineken nhập khẩu.', en: 'Imported Heineken beer.' }, location: { vi: 'Khu M39', en: 'Zone M39' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Tiger', en: 'Tiger Booth' }, company: { vi: 'Tiger', en: 'Tiger' }, description: { vi: 'Bia Tiger nhập khẩu.', en: 'Imported Tiger beer.' }, location: { vi: 'Khu N40', en: 'Zone N40' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Carlsberg', en: 'Carlsberg Booth' }, company: { vi: 'Carlsberg', en: 'Carlsberg' }, description: { vi: 'Bia Carlsberg nhập khẩu.', en: 'Imported Carlsberg beer.' }, location: { vi: 'Khu O41', en: 'Zone O41' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Strongbow', en: 'Strongbow Booth' }, company: { vi: 'Strongbow', en: 'Strongbow' }, description: { vi: 'Nước táo lên men Strongbow.', en: 'Strongbow cider.' }, location: { vi: 'Khu P42', en: 'Zone P42' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Mirinda', en: 'Mirinda Booth' }, company: { vi: 'Mirinda', en: 'Mirinda' }, description: { vi: 'Nước ngọt Mirinda các vị.', en: 'Mirinda soft drinks in various flavors.' }, location: { vi: 'Khu Q43', en: 'Zone Q43' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Sprite', en: 'Sprite Booth' }, company: { vi: 'Sprite', en: 'Sprite' }, description: { vi: 'Nước ngọt Sprite.', en: 'Sprite soft drink.' }, location: { vi: 'Khu R44', en: 'Zone R44' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống 7Up', en: '7Up Booth' }, company: { vi: '7Up', en: '7Up' }, description: { vi: 'Nước ngọt 7Up.', en: '7Up soft drink.' }, location: { vi: 'Khu S45', en: 'Zone S45' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Fanta', en: 'Fanta Booth' }, company: { vi: 'Fanta', en: 'Fanta' }, description: { vi: 'Nước ngọt Fanta các vị.', en: 'Fanta soft drinks in various flavors.' }, location: { vi: 'Khu T46', en: 'Zone T46' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Dr Thanh', en: 'Dr Thanh Booth' }, company: { vi: 'Dr Thanh', en: 'Dr Thanh' }, description: { vi: 'Trà thảo mộc Dr Thanh.', en: 'Dr Thanh herbal tea.' }, location: { vi: 'Khu U47', en: 'Zone U47' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống C2', en: 'C2 Booth' }, company: { vi: 'C2', en: 'C2' }, description: { vi: 'Trà xanh C2.', en: 'C2 green tea.' }, location: { vi: 'Khu V48', en: 'Zone V48' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Oishi', en: 'Oishi Booth' }, company: { vi: 'Oishi', en: 'Oishi' }, description: { vi: 'Snack và nước giải khát Oishi.', en: 'Oishi snacks and soft drinks.' }, location: { vi: 'Khu W49', en: 'Zone W49' }, coverImageUrl: '/placeholder.svg' },
        { name: { vi: 'Gian hàng Đồ uống Cosy', en: 'Cosy Booth' }, company: { vi: 'Cosy', en: 'Cosy' }, description: { vi: 'Bánh quy Cosy và nước giải khát.', en: 'Cosy biscuits and soft drinks.' }, location: { vi: 'Khu X50', en: 'Zone X50' }, coverImageUrl: '/placeholder.svg' }
      ];
      // Pick 2 unique booths for each event
      const booth1 = boothPool[(i * 2 - 2) % boothPool.length];
      const booth2 = boothPool[(i * 2 - 1) % boothPool.length];
      const booths = [booth1, booth2];
      // 20 unique ticket types
      const ticketTypePool = [
        { name: { vi: 'Vé Thường', en: 'General Admission' }, description: { vi: 'Vé vào cửa tiêu chuẩn cho sự kiện.', en: 'Standard entry ticket for the event.' }, price: 100000, quantity: 200 },
        { name: { vi: 'Vé VIP', en: 'VIP Ticket' }, description: { vi: 'Vé VIP với chỗ ngồi ưu tiên và quà tặng.', en: 'VIP ticket with priority seating and gifts.' }, price: 500000, quantity: 50 },
        { name: { vi: 'Vé Sinh viên', en: 'Student Ticket' }, description: { vi: 'Dành cho sinh viên, cần xuất trình thẻ.', en: 'For students, student ID required.' }, price: 50000, quantity: 100 },
        { name: { vi: 'Vé Early Bird', en: 'Early Bird Ticket' }, description: { vi: 'Vé giá ưu đãi cho người mua sớm.', en: 'Discounted ticket for early buyers.' }, price: 80000, quantity: 80 },
        { name: { vi: 'Vé Nhóm', en: 'Group Ticket' }, description: { vi: 'Vé dành cho nhóm 5 người trở lên.', en: 'For groups of 5 or more.' }, price: 400000, quantity: 30 },
        { name: { vi: 'Vé Gia đình', en: 'Family Ticket' }, description: { vi: 'Vé cho gia đình 2 người lớn và 2 trẻ em.', en: 'For families (2 adults, 2 children).' }, price: 350000, quantity: 20 },
        { name: { vi: 'Vé Miễn phí', en: 'Free Ticket' }, description: { vi: 'Vé miễn phí cho khách mời đặc biệt.', en: 'Free ticket for special guests.' }, price: 10000, quantity: 10 },
        { name: { vi: 'Vé Workshop', en: 'Workshop Ticket' }, description: { vi: 'Tham dự các buổi workshop chuyên đề.', en: 'Access to special workshops.' }, price: 150000, quantity: 40 },
        { name: { vi: 'Vé Online', en: 'Online Ticket' }, description: { vi: 'Tham dự sự kiện trực tuyến.', en: 'Online event access.' }, price: 30000, quantity: 300 },
        { name: { vi: 'Vé Premium', en: 'Premium Ticket' }, description: { vi: 'Vé cao cấp với nhiều quyền lợi.', en: 'Premium ticket with extra benefits.' }, price: 700000, quantity: 20 },
        { name: { vi: 'Vé Doanh nghiệp', en: 'Corporate Ticket' }, description: { vi: 'Dành cho khách doanh nghiệp.', en: 'For corporate guests.' }, price: 1000000, quantity: 15 },
        { name: { vi: 'Vé Trẻ em', en: 'Child Ticket' }, description: { vi: 'Dành cho trẻ em dưới 12 tuổi.', en: 'For children under 12.' }, price: 30000, quantity: 60 },
        { name: { vi: 'Vé Couple', en: 'Couple Ticket' }, description: { vi: 'Vé cho 2 người lớn.', en: 'Ticket for 2 adults.' }, price: 180000, quantity: 40 },
        { name: { vi: 'Vé Super VIP', en: 'Super VIP Ticket' }, description: { vi: 'Vé siêu VIP, gặp gỡ diễn giả.', en: 'Super VIP, includes meet & greet.' }, price: 2000000, quantity: 5 },
        { name: { vi: 'Vé Tham quan', en: 'Visitor Ticket' }, description: { vi: 'Vé tham quan triển lãm.', en: 'Exhibition visitor ticket.' }, price: 60000, quantity: 100 },
        { name: { vi: 'Vé Media', en: 'Media Ticket' }, description: { vi: 'Dành cho phóng viên, báo chí.', en: 'For journalists and media.' }, price: 10000, quantity: 20 },
        { name: { vi: 'Vé Đối tác', en: 'Partner Ticket' }, description: { vi: 'Dành cho đối tác sự kiện.', en: 'For event partners.' }, price: 10000, quantity: 15 },
        { name: { vi: 'Vé Ban tổ chức', en: 'Organizer Ticket' }, description: { vi: 'Dành cho thành viên ban tổ chức.', en: 'For organizing committee.' }, price: 10000, quantity: 30 },
        { name: { vi: 'Vé Khách mời', en: 'Guest Ticket' }, description: { vi: 'Dành cho khách mời danh dự.', en: 'For honorary guests.' }, price: 10000, quantity: 10 },
        { name: { vi: 'Vé Trải nghiệm', en: 'Experience Ticket' }, description: { vi: 'Vé trải nghiệm dịch vụ đặc biệt.', en: 'Special experience ticket.' }, price: 250000, quantity: 25 }
      ];
      // Pick 2 unique ticket types for each event
      const ticketType1 = ticketTypePool[(i * 2 - 2) % ticketTypePool.length];
      const ticketType2 = ticketTypePool[(i * 2 - 1) % ticketTypePool.length];
      const ticketTypes = [ticketType1, ticketType2];
      // Long, realistic event description
      const longDescription = {
        vi: `Sự kiện "${nameObj.vi}" là một trong những sự kiện nổi bật nhất năm, quy tụ các chuyên gia, diễn giả và doanh nghiệp hàng đầu trong lĩnh vực ${cat}. Chương trình kéo dài nhiều ngày với các hoạt động đa dạng như hội thảo chuyên đề, triển lãm sản phẩm, kết nối doanh nghiệp, và các buổi giao lưu, chia sẻ kinh nghiệm thực tiễn. Người tham dự sẽ có cơ hội tiếp cận các xu hướng mới nhất, tham gia các workshop thực hành, gặp gỡ các nhà đầu tư, đối tác tiềm năng và mở rộng mạng lưới quan hệ. Ngoài ra, sự kiện còn có các khu vực trải nghiệm công nghệ, khu ẩm thực, giải trí và nhiều phần quà hấp dẫn dành cho khách tham dự. Đây là dịp lý tưởng để cập nhật kiến thức, phát triển kỹ năng và khám phá những cơ hội mới trong ngành ${cat}.`,
        en: `The "${nameObj.en}" is one of the most anticipated events of the year, bringing together top experts, speakers, and businesses in the ${cat} sector. The multi-day program features a wide range of activities including keynote seminars, product exhibitions, business networking sessions, and interactive workshops. Attendees will have the chance to explore the latest trends, participate in hands-on sessions, meet investors and potential partners, and expand their professional network. The event also offers technology experience zones, food courts, entertainment areas, and many exciting gifts for participants. This is the perfect opportunity to update your knowledge, develop new skills, and discover fresh opportunities in the field of ${cat}.`
      };
      // 30 unique, realistic locations
      const locationPool = [
        { vi: 'Trung tâm Hội nghị Quốc gia, Hà Nội', en: 'National Convention Center, Hanoi' },
        { vi: 'Trung tâm Triển lãm SECC, TP.HCM', en: 'SECC Exhibition Center, Ho Chi Minh City' },
        { vi: 'Khách sạn Melia, Hà Nội', en: 'Melia Hotel, Hanoi' },
        { vi: 'Khách sạn Lotte, Hà Nội', en: 'Lotte Hotel, Hanoi' },
        { vi: 'Trung tâm Hội nghị GEM, TP.HCM', en: 'GEM Center, Ho Chi Minh City' },
        { vi: 'Trung tâm Hội nghị Riverside Palace, TP.HCM', en: 'Riverside Palace, Ho Chi Minh City' },
        { vi: 'Khách sạn InterContinental, Đà Nẵng', en: 'InterContinental Hotel, Danang' },
        { vi: 'Trung tâm Hội nghị White Palace, TP.HCM', en: 'White Palace Convention Center, Ho Chi Minh City' },
        { vi: 'Trung tâm Hội nghị 272, TP.HCM', en: '272 Convention Center, Ho Chi Minh City' },
        { vi: 'Khách sạn Sheraton, Hà Nội', en: 'Sheraton Hotel, Hanoi' },
        { vi: 'Trung tâm Hội nghị Ariyana, Đà Nẵng', en: 'Ariyana Convention Center, Danang' },
        { vi: 'Trung tâm Hội nghị Quốc tế, Hà Nội', en: 'International Convention Center, Hanoi' },
        { vi: 'Khách sạn Pullman, Vũng Tàu', en: 'Pullman Hotel, Vung Tau' },
        { vi: 'Trung tâm Hội nghị Grand Plaza, Hà Nội', en: 'Grand Plaza Convention Center, Hanoi' },
        { vi: 'Khách sạn JW Marriott, Hà Nội', en: 'JW Marriott Hotel, Hanoi' },
        { vi: 'Trung tâm Hội nghị Tỉnh Bình Dương', en: 'Binh Duong Convention Center' },
        { vi: 'Trung tâm Hội nghị Tỉnh Quảng Ninh', en: 'Quang Ninh Convention Center' },
        { vi: 'Khách sạn Novotel, Đà Nẵng', en: 'Novotel Hotel, Danang' },
        { vi: 'Trung tâm Hội nghị Tỉnh Đồng Nai', en: 'Dong Nai Convention Center' },
        { vi: 'Trung tâm Hội nghị Tỉnh Cần Thơ', en: 'Can Tho Convention Center' },
        { vi: 'Khách sạn Sofitel, TP.HCM', en: 'Sofitel Hotel, Ho Chi Minh City' },
        { vi: 'Trung tâm Hội nghị Tỉnh Hải Phòng', en: 'Hai Phong Convention Center' },
        { vi: 'Khách sạn Rex, TP.HCM', en: 'Rex Hotel, Ho Chi Minh City' },
        { vi: 'Trung tâm Hội nghị Tỉnh Thanh Hóa', en: 'Thanh Hoa Convention Center' },
        { vi: 'Khách sạn Majestic, TP.HCM', en: 'Majestic Hotel, Ho Chi Minh City' },
        { vi: 'Trung tâm Hội nghị Tỉnh Nghệ An', en: 'Nghe An Convention Center' },
        { vi: 'Khách sạn Imperial, Vũng Tàu', en: 'Imperial Hotel, Vung Tau' },
        { vi: 'Trung tâm Hội nghị Tỉnh Bắc Ninh', en: 'Bac Ninh Convention Center' },
        { vi: 'Khách sạn Mường Thanh, Đà Nẵng', en: 'Muong Thanh Hotel, Danang' },
        { vi: 'Trung tâm Hội nghị Tỉnh Lâm Đồng', en: 'Lam Dong Convention Center' }
      ];
      const location = locationPool[i % locationPool.length];
      // Generate random future startDate and endDate (endDate > startDate)
      const now = new Date();
      // Randomly pick a start date between 7 and 365 days from now
      const startOffset = Math.floor(Math.random() * 358) + 7; // 7..364 days
      const startDateObj = new Date(now.getTime() + startOffset * 24 * 60 * 60 * 1000);
      // Randomly pick a duration between 1 and 5 days
      const duration = Math.floor(Math.random() * 5) + 1;
      const endDateObj = new Date(startDateObj.getTime() + duration * 24 * 60 * 60 * 1000);
      const startDate = startDateObj.toISOString().slice(0, 10); // yyyy-mm-dd
      const endDate = endDateObj.toISOString().slice(0, 10);
      // Realistic ticket categories pool
      const ticketCategoryPool = [
        'Standard',
        'VIP',
        'Early Bird',
        'Student',
        'Group',
        'Premium',
        'Online',
        'In-person',
        'Family',
        'Corporate',
        'Press',
        'Speaker',
        'Sponsor',
        'Exhibitor',
        'Workshop',
        'All Access',
        'One Day',
        'Weekend',
        'Late Entry',
        'Children',
        'Senior',
        'Combo',
        'Meet & Greet',
        'Backstage',
        'Charity',
        'Networking',
        'VIP Lounge',
        'After Party',
        'Front Row',
        'Balcony',
        'Standing'
      ];
      // Pick 2-4 random ticket categories for each event
      const shuffledCategories = ticketCategoryPool.sort(() => 0.5 - Math.random());
      const numCategories = Math.floor(Math.random() * 3) + 2; // 2-4
      const ticketCategories = shuffledCategories.slice(0, numCategories);
      // Pool of realistic event image URLs
      const imagePool = [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1503676382389-4809596d5290',
        'https://images.unsplash.com/photo-1515169067865-5387a1b0b2b3',
        'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZXZlbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZXZlbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60'
      ];
      const coverImage = imagePool[i % imagePool.length];
      // Each event can have 1-3 media images
      const shuffledImages = imagePool.sort(() => 0.5 - Math.random());
      const numMedia = Math.floor(Math.random() * 3) + 1;
      const media = shuffledImages.slice(0, numMedia);
      // Dynamic tabConfig based on event category
      const tabConfigPresets = {
        'Hội thảo': { info: true, schedule: true, speakers: true, sponsors: true, tickets: true },
        'Triển lãm': { info: true, booths: true, schedule: true, sponsors: true },
        'Âm nhạc': { info: true, schedule: true, artists: true, tickets: true },
        'Thể thao': { info: true, schedule: true, teams: true, tickets: true },
        'Giáo dục': { info: true, schedule: true, speakers: true, tickets: true },
        'Công nghệ': { info: true, schedule: true, speakers: true, sponsors: true, tickets: true },
        'Từ thiện': { info: true, schedule: true, sponsors: true, tickets: true },
        'Ẩm thực': { info: true, booths: true, schedule: true, tickets: true },
        'Thời trang': { info: true, schedule: true, designers: true, tickets: true },
        'Khác': { info: true, schedule: true, tickets: true }
      };
      // Fallback to 'Khác' if category not found
      const tabConfig = tabConfigPresets[cat] || tabConfigPresets['Khác'];
      // Generate realistic days array for the event
      // Pool of realistic activities
      const activityPool = [
        {
          title: { vi: 'Khai mạc', en: 'Opening Ceremony' },
          description: { vi: 'Lễ khai mạc sự kiện với phần phát biểu của ban tổ chức.', en: 'Opening ceremony with speeches from organizers.' },
          type: 'ceremony',
        },
        {
          title: { vi: 'Thuyết trình chủ đề', en: 'Keynote Speech' },
          description: { vi: 'Bài thuyết trình chính về chủ đề sự kiện.', en: 'Main keynote speech on the event topic.' },
          type: 'keynote',
        },
        {
          title: { vi: 'Workshop chuyên đề', en: 'Specialized Workshop' },
          description: { vi: 'Buổi workshop đào sâu vào một chủ đề cụ thể.', en: 'Workshop focusing on a specific topic.' },
          type: 'workshop',
        },
        {
          title: { vi: 'Giao lưu & Networking', en: 'Networking Session' },
          description: { vi: 'Thời gian giao lưu, kết nối giữa các khách mời.', en: 'Networking time for guests to connect.' },
          type: 'networking',
        },
        {
          title: { vi: 'Trình diễn nghệ thuật', en: 'Art Performance' },
          description: { vi: 'Chương trình biểu diễn nghệ thuật đặc sắc.', en: 'Special art performance program.' },
          type: 'performance',
        },
        {
          title: { vi: 'Bế mạc', en: 'Closing Ceremony' },
          description: { vi: 'Lễ bế mạc tổng kết sự kiện.', en: 'Closing ceremony and event summary.' },
          type: 'ceremony',
        },
        {
          title: { vi: 'Thảo luận nhóm', en: 'Panel Discussion' },
          description: { vi: 'Thảo luận nhóm với các chuyên gia.', en: 'Panel discussion with experts.' },
          type: 'panel',
        },
        {
          title: { vi: 'Trưng bày sản phẩm', en: 'Product Showcase' },
          description: { vi: 'Khu vực trưng bày sản phẩm mới.', en: 'Area for showcasing new products.' },
          type: 'showcase',
        },
        {
          title: { vi: 'Giải lao', en: 'Break Time' },
          description: { vi: 'Thời gian nghỉ giải lao giữa các phiên.', en: 'Break time between sessions.' },
          type: 'break',
        },
        {
          title: { vi: 'Tiệc tối', en: 'Gala Dinner' },
          description: { vi: 'Bữa tiệc tối giao lưu giữa các đại biểu.', en: 'Evening gala dinner for delegates.' },
          type: 'dinner',
        }
      ];
      const days: any[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Pool of realistic room locations
      const roomPool = [
        { vi: 'Phòng Hội thảo A', en: 'Conference Room A' },
        { vi: 'Phòng Hội thảo B', en: 'Conference Room B' },
        { vi: 'Phòng Hội thảo C', en: 'Conference Room C' },
        { vi: 'Phòng Đa năng 1', en: 'Multipurpose Room 1' },
        { vi: 'Phòng Đa năng 2', en: 'Multipurpose Room 2' },
        { vi: 'Phòng Sự kiện 101', en: 'Event Room 101' },
        { vi: 'Phòng Sự kiện 202', en: 'Event Room 202' },
        { vi: 'Phòng VIP', en: 'VIP Room' },
        { vi: 'Sảnh lớn', en: 'Grand Hall' },
        { vi: 'Sân khấu chính', en: 'Main Stage' },
        { vi: 'Khu vực Workshop', en: 'Workshop Area' },
        { vi: 'Khu vực Triển lãm', en: 'Exhibition Area' },
        { vi: 'Phòng họp 1', en: 'Meeting Room 1' },
        { vi: 'Phòng họp 2', en: 'Meeting Room 2' },
        { vi: 'Phòng họp 3', en: 'Meeting Room 3' },
        { vi: 'Phòng Đào tạo', en: 'Training Room' },
        { vi: 'Phòng Truyền thông', en: 'Media Room' },
        { vi: 'Phòng Ban tổ chức', en: 'Organizer Room' },
        { vi: 'Khu vực Networking', en: 'Networking Area' },
        { vi: 'Khu vực Ăn uống', en: 'Dining Area' }
      ];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        // Pick 2-4 random activities for each day
        const shuffled = activityPool.sort(() => 0.5 - Math.random());
        const numActs = Math.floor(Math.random() * 3) + 2;
        // Generate time slots for activities
        let hour = 8;
        const activities = shuffled.slice(0, numActs).map((act, idx) => {
          const startTime = `${hour.toString().padStart(2, '0')}:00`;
          hour += 2;
          const endTime = `${hour.toString().padStart(2, '0')}:00`;
          const room = roomPool[Math.floor(Math.random() * roomPool.length)];
          return {
            ...act,
            startTime,
            endTime,
            location: room,
            speakerIds: []
          };
        });
        days.push({
          date: d.toISOString().slice(0, 10),
          activities
        });
      }
      events.push({
        title: nameObj,
        description: longDescription,
        category: cat,
        location,
        startDate,
        endDate,
        isFreeEvent: i % 2 === 0,
        media,
        coverImage,
        tabConfig,
        eventType: cat,
        ticketCategories,
        days,
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
