
import { Controller, Post, Body, HttpException, HttpStatus, Inject, Res } from '@nestjs/common';
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
    ) { }

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
    async chat(@Body('message') message: string, @Res() res: any) {
        if (!message) {
            throw new HttpException('Missing message', HttpStatus.BAD_REQUEST);
        }
        try {
            // Lấy top 3 event liên quan nhất để context ngắn, tập trung
            const topEvents = await searchEventsQdrant(message, 3);
            if (!topEvents || topEvents.length === 0) {
                console.error('No relevant event found in Qdrant');
                throw new HttpException('No relevant event found', HttpStatus.NOT_FOUND);
            }
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
                const eventId = typeof event.id === 'string' || typeof event.id === 'number' ? event.id : String(event.id);
                const speakers = await this.speakerRepo.find({ where: { event: { id: eventId } as any } });
                const tickets = await this.ticketTypeRepo.find({ where: { event: { id: eventId } as any } });
                const booths = await this.boothRepo.find({ where: { event: { id: eventId } as any } });
                const eventDays = await this.eventDayRepo.find({ where: { event: { id: eventId } as any }, relations: ['activities'] });
                const activities = eventDays.flatMap((day: any) => day.activities || []);
                allData.push({ event, speakers, tickets, booths, activities });
            }
            // Format context rõ ràng, dễ đọc cho LLM
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
            function objToLines(obj: any): string {
                return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(' | ');
            }
            const context = allData.map((data, idx) => {
                const event = flattenMultilingual(data.event);
                const speakers = data.speakers.map(flattenMultilingual);
                const tickets = data.tickets.map(flattenMultilingual);
                const booths = data.booths.map(flattenMultilingual);
                const activities = data.activities.map(flattenMultilingual);
                return [
                    `==== Event #${idx + 1} ====`,
                    objToLines(event),
                    'Speakers:',
                    speakers.length ? speakers.map(objToLines).join('\n') : 'None',
                    'Tickets:',
                    tickets.length ? tickets.map(objToLines).join('\n') : 'None',
                    'Booths:',
                    booths.length ? booths.map(objToLines).join('\n') : 'None',
                    'Activities:',
                    activities.length ? activities.map(objToLines).join('\n') : 'None',
                ].join('\n');
            }).join('\n\n');
            //
            // Prompt tối ưu, nhấn mạnh KHÔNG được bịa, có ví dụ rõ ràng
            const systemPrompt =
                `You are a multilingual event assistant. Always answer in the same language as the user's question.\n` +
                `You MUST ONLY answer using the event data below. If the answer is not in the data, reply exactly:\n` +
                `- "Tôi không tìm thấy thông tin phù hợp." (if the question is in Vietnamese)\n` +
                `- "I could not find relevant information." (if in English).\n` +
                `Do NOT make up, infer, or hallucinate any information.\n` +
                `Always mention event names using the 'title' field.\n` +
                `If there are multiple events, list their names clearly.\n` +
                `\nEXAMPLES:\n` +
                `User: Sự kiện nổi bật tháng 8 là gì?\nAssistant: Sự kiện nổi bật tháng 8 là \"Hội thảo AI 2025\" và \"Ngày hội Công nghệ\".\n` +
                `User: What are the top events in August?\nAssistant: The top events in August are \"AI Conference 2025\" and \"Tech Expo\".\n` +
                `User: Sự kiện về blockchain ở Đà Nẵng?\nAssistant: Tôi không tìm thấy thông tin phù hợp.\n` +
                `User: Any events about blockchain in Danang?\nAssistant: I could not find relevant information.\n` +
                `\n==== EVENT DATA BELOW ====\n` +
                context;

            // Lấy lịch sử hội thoại từ client (nếu có), mặc định là mảng rỗng
            let history: Array<{ from: string, text: string }> = [];
            try {
                if (typeof (res.req.body.history) !== 'undefined') {
                    history = Array.isArray(res.req.body.history) ? res.req.body.history : [];
                }
            } catch {}

            // Chuyển đổi lịch sử hội thoại sang format messages của LLM
            const historyMessages = history.map((msg) => {
                if (msg.from === 'user') return { role: 'user', content: msg.text };
                if (msg.from === 'bot') return { role: 'assistant', content: msg.text };
                return null;
            }).filter(Boolean);

            // Xây dựng messages: system prompt, history, user message mới nhất
            const messages = [
                { role: 'system', content: systemPrompt },
                ...historyMessages,
                { role: 'user', content: message }
            ];
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            const ollamaRes = await fetch('http://192.168.76.132:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.2',
                    messages,
                    stream: true
                })
            });
            if (!ollamaRes.body) throw new Error('No stream body from Ollama');
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            ollamaRes.body.on('data', (chunk) => {
                buffer += decoder.decode(chunk);
                let lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.trim()) continue;
                    //
                    try {
                        if (line.trim().startsWith('{')) {
                            const parsed = JSON.parse(line);
                            // Sửa: lấy message.content nếu có
                            if (parsed.message && parsed.message.content) {
                                res.write(`data: ${JSON.stringify({ chunk: parsed.message.content })}\n\n`);
                                if (typeof (res as any).flush === 'function') (res as any).flush();
                            }
                        }
                    } catch (err) {
                        // console.error('[Ollama JSON parse error]', err, line);
                    }
                }
            });
            ollamaRes.body.on('end', () => {
                res.end();
            });
            ollamaRes.body.on('error', (err) => {
                res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
                res.end();
            });
        } catch (err) {
            // console.error('Chatbot error:', err);
            res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
            res.end();
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
