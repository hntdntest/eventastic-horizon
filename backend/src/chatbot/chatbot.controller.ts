

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
import { searchEventsQdrant, initQdrantCollection, upsertEventToQdrant, getEventByIdQdrant } from './qdrant.service';

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

    /**
     * Debug endpoint: Trả về raw event từ Qdrant theo eventId
     * POST /ai-chatbot/debug-qdrant { eventId: string }
     */
    @Post('debug-qdrant')
    async debugQdrant(@Body() body: { eventId: string }, @Res() res: any) {
        try {
            const eventId = body.eventId;
            console.log('[debugQdrant] eventId:', eventId);
            if (!eventId) {
                throw new HttpException('Missing eventId', HttpStatus.BAD_REQUEST);
            }
            const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
            const collection = process.env.QDRANT_COLLECTION || 'events';
            const fetchRes = await fetch(`${qdrantUrl}/collections/${collection}/points/get`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [eventId] })
            });
            const data = await fetchRes.json();
            console.log('[debugQdrant] Qdrant response:', JSON.stringify(data, null, 2));
            return res.json(data);
        } catch (err) {
            console.error('[debugQdrant] error:', err);
            return res.status(500).json({ error: 'Failed to query Qdrant', detail: err?.message });
        }
    }

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
            // Lấy tất cả event từ Qdrant (không giới hạn topK)
            type QdrantEvent = Record<string, any>;
            const eventsForContext: QdrantEvent[] = [];
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
                    } else {
                        result[key] = val;
                    }
                }
                return result;
            }
            // Query Qdrant để lấy toàn bộ event (dùng points/scroll, không filter)
            const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
            const collection = process.env.QDRANT_COLLECTION || 'events';
            let allEvents: any[] = [];
            let offset = undefined;
            while (true) {
                const resQ = await fetch(`${qdrantUrl}/collections/${collection}/points/scroll`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        limit: 64,
                        offset,
                        with_payload: true
                    })
                });
                const data = await resQ.json();
                if (data && data.result && data.result.points && data.result.points.length > 0) {
                    allEvents = allEvents.concat(data.result.points);
                    if (data.result.next_page_offset) {
                        offset = data.result.next_page_offset;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            for (const point of allEvents) {
                if (!point || !point.payload) continue;
                const eventFlat = flattenMultilingual(point.payload);
                // Chỉ lấy các trường tên sự kiện
                const eventTitleOnly: Record<string, any> = {};
                if (eventFlat.title) eventTitleOnly.title = eventFlat.title;
                if (eventFlat.title_vi) eventTitleOnly.title_vi = eventFlat.title_vi;
                if (eventFlat.title_en) eventTitleOnly.title_en = eventFlat.title_en;
                eventsForContext.push(eventTitleOnly);
            }
            const contextJson = eventsForContext;
            //
            // Prompt tối ưu, nhấn mạnh KHÔNG được bịa, có ví dụ rõ ràng
            const systemPrompt =
                `You are a multilingual event assistant. Always answer in the same language as the user's question.\n` +
                `You MUST ONLY answer using the event data provided in the JSON array. If the answer is not in the data, reply exactly:\n` +
                `- "Tôi không tìm thấy thông tin phù hợp." (if the question is in Vietnamese)\n` +
                `- "I could not find relevant information." (if in English).\n` +
                `Do NOT make up, infer, or hallucinate any information.\n` +
                `Always mention event names using the 'title' field.\n` +
                `If there are multiple events, list their names clearly.\n` +
                `The event data is provided as a JSON array in the next message.\n` +
                `\nEXAMPLES:\n` +
                `User: Sự kiện nổi bật tháng 8 là gì?\nAssistant: Sự kiện nổi bật tháng 8 là \"Hội thảo AI 2025\" và \"Ngày hội Công nghệ\".\n` +
                `User: What are the top events in August?\nAssistant: The top events in August are \"AI Conference 2025\" and \"Tech Expo\".\n` +
                `User: Sự kiện về blockchain ở Đà Nẵng?\nAssistant: Tôi không tìm thấy thông tin phù hợp.\n` +
                `User: Any events about blockchain in Danang?\nAssistant: I could not find relevant information.\n`;

            // Debug: log context and messages sent to LLM
            //console.log('[chatbot] contextJson:', JSON.stringify(contextJson, null, 2));
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
            // Debug: log historyMessages
            //console.log('[chatbot] historyMessages:', JSON.stringify(historyMessages, null, 2));

            // Xây dựng messages: system prompt, history, user message mới nhất
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'system', content: `EVENT DATA (JSON):\n${JSON.stringify(contextJson, null, 2)}` },
                ...historyMessages,
                { role: 'user', content: message }
            ];
            //console.log('[chatbot] messages to LLM:', JSON.stringify(messages, null, 2));
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            const ollamaApiUrl = process.env.OLLAMA_API_URL;
            const ollamaModel = process.env.OLLAMA_MODEL;
            const ollamaRes = await fetch(ollamaApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: ollamaModel,
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
            console.error('[chatbot] Internal server error:', err);
            res.write(`data: ${JSON.stringify({ error: 'Internal server error', detail: err?.message, stack: err?.stack })}\n\n`);
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
