
import { Controller, Post, Body, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { franc } from 'franc';
import fetch from 'node-fetch';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from '../events/entities/event.entity';
import { Speaker } from '../events/entities/speaker.entity';
import { TicketType } from '../events/entities/ticket-type.entity';
import { Booth } from '../events/entities/booth.entity';
import { Activity } from '../events/entities/activity.entity';
import { EventDay } from '../events/entities/event-day.entity';
import { searchEventsQdrant, initQdrantCollection, upsertEventToQdrant } from './qdrant.service';

// Helper: fetch data from all event-related tables for ALL events
type EventFullData = {
  event: Event;
  speakers: Speaker[];
  tickets: TicketType[];
  booths: Booth[];
  activities: Activity[];
};

@Controller('ai-chatbot')
export class ChatbotController {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Speaker) private readonly speakerRepo: Repository<Speaker>,
    @InjectRepository(TicketType) private readonly ticketTypeRepo: Repository<TicketType>,
    @InjectRepository(Booth) private readonly boothRepo: Repository<Booth>,
    @InjectRepository(EventDay) private readonly eventDayRepo: Repository<EventDay>,
  ) {}

  private async getAllEventData(): Promise<EventFullData[]> {
    const events = await this.eventRepo.find({ order: { startDate: 'DESC' } });
    const allData: EventFullData[] = [];
    for (const event of events) {
      const eventId = event.id;
      const speakers = await this.speakerRepo.find({ where: { event: { id: eventId } } });
      const tickets = await this.ticketTypeRepo.find({ where: { event: { id: eventId } } });
      const booths = await this.boothRepo.find({ where: { event: { id: eventId } } });
      const eventDays = await this.eventDayRepo.find({ where: { event: { id: eventId } }, relations: ['activities'] });
      const activities = eventDays.flatMap((day: any) => day.activities || []);
      allData.push({ event, speakers, tickets, booths, activities });
    }
    return allData;
  }

  @Post()
  async chat(@Body('message') message: string) {
    if (!message) {
      throw new HttpException('Missing message', HttpStatus.BAD_REQUEST);
    }
    try {
      console.log('Received message:', message);
      // Lấy top-k event liên quan từ Qdrant
      const topEvents = await searchEventsQdrant(message, 5);
      if (!topEvents || topEvents.length === 0) {
        console.error('No relevant event found in Qdrant');
        throw new HttpException('No relevant event found', HttpStatus.NOT_FOUND);
      }
      // Lấy thêm thông tin speakers, tickets, booths, activities cho từng event
      type QdrantEvent = Record<string, any>;
      const allData: Array<{
        event: QdrantEvent;
        speakers: Speaker[];
        tickets: TicketType[];
        booths: Booth[];
        activities: Activity[];
      }> = [];
      for (const event of topEvents) {
        if (!event || !event.id) continue;
        // Qdrant trả về id có thể là string hoặc number
        const eventId = typeof event.id === 'string' || typeof event.id === 'number' ? event.id : String(event.id);
        const speakers = await this.speakerRepo.find({ where: { event: { id: eventId } as any } });
        const tickets = await this.ticketTypeRepo.find({ where: { event: { id: eventId } as any } });
        const booths = await this.boothRepo.find({ where: { event: { id: eventId } as any } });
        const eventDays = await this.eventDayRepo.find({ where: { event: { id: eventId } as any }, relations: ['activities'] });
        const activities = eventDays.flatMap((day: any) => day.activities || []);
        allData.push({ event, speakers, tickets, booths, activities });
      }
      // Detect language from message
      let lang = 'en';
      try {
        const francLang = franc(message);
        if (francLang === 'vie') lang = 'vi';
        else if (francLang === 'eng') lang = 'en';
      } catch {}


      // Format object: flatten multilingual fields (title_en, title_vi, ...), giữ nguyên các trường khác
      function flattenMultilingual(obj: any): any {
        if (!obj || typeof obj !== 'object') return obj;
        const result: any = {};
        for (const key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          const val = obj[key];
          if (val && typeof val === 'object' && (val.vi || val.en)) {
            for (const langKey in val) {
              if (val[langKey]) {
                result[`${key}_${langKey}`] = val[langKey];
              }
            }
          } else if (Array.isArray(val)) {
            result[key] = val.map(flattenMultilingual);
          } else {
            result[key] = val;
          }
        }
        return result;
      }

      const context = allData.map((data, idx) => {
        const event = flattenMultilingual(data.event);
        const speakers = data.speakers.map(flattenMultilingual);
        const tickets = data.tickets.map(flattenMultilingual);
        const booths = data.booths.map(flattenMultilingual);
        const activities = data.activities.map(flattenMultilingual);
        function objToLines(obj: any): string {
          return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(' | ');
        }
        return [
          `Event #${idx + 1}:`,
          objToLines(event),
          'Speakers:',
          speakers.map(objToLines).join(' || '),
          'Tickets:',
          tickets.map(objToLines).join(' || '),
          'Booths:',
          booths.map(objToLines).join(' || '),
          'Activities:',
          activities.map(objToLines).join(' || ')
        ].join('\n');
      }).join('\n---\n');
      console.log('Composed context for LLM:', context.substring(0, 1000) + (context.length > 1000 ? '...truncated' : ''));
      // Thêm hướng dẫn trả lời đúng ngôn ngữ và show rõ tên sự kiện (field title trong table event)
      const prompt = `You are an event assistant. Use the following event data to answer user questions.\n` +
        `When answering, always mention the event name using the 'title' field from the event table. ` +
        `If there are multiple events, list their names clearly.\n` +
        `${context}\nUser: ${message}\nAssistant: Please answer in the same language as the user's question.`;
      const ollamaRes = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt,
          stream: false
        })
      });
      const ollamaData = await ollamaRes.json();
      console.log('Ollama response:', ollamaData);
      const answer = ollamaData.response || 'Sorry, I could not generate a response.';
      return { answer };
    } catch (err) {
      console.error('Chatbot error:', err);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('index-events')
  async indexEvents() {
    try {
      await initQdrantCollection();
      const events = await this.eventRepo.find();
      let success = 0, fail = 0;
      for (const event of events) {
        try {
          await upsertEventToQdrant(event);
          success++;
        } catch (e) {
          fail++;
        }
      }
      return { message: `Indexed ${success} events to Qdrant. Failed: ${fail}` };
    } catch (err) {
      throw new HttpException('Failed to index events', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }  
}
