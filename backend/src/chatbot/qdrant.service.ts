
import { QdrantClient } from '@qdrant/js-client-rest';
import fetch from 'node-fetch';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const COLLECTION_NAME = 'events';
const EMBEDDING_DIM = 384; // Số chiều vector của model all-MiniLM-L6-v2 (sentence-transformers)

export const qdrant = new QdrantClient({ url: QDRANT_URL });

// Hàm lấy embedding từ service Python local (FastAPI)
export async function getEmbeddingOllama(text: string): Promise<number[]> {
  const res = await fetch('http://localhost:8000/embedding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  if (!data.embedding) throw new Error('No embedding returned from embedding service');
  return data.embedding;
}

// Hàm index 1 event lên Qdrant
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

export async function upsertEventToQdrant(event: any) {
  const flat = flattenMultilingual(event);
  const text = `${flat.title_en || ''} ${flat.title_vi || ''} ${flat.description_en || ''} ${flat.description_vi || ''}`;
  const vector = await getEmbeddingOllama(text);
//   console.log('[upsertEventToQdrant] Indexing event:', {
//     id: event.id,
//     title_en: flat.title_en,
//     title_vi: flat.title_vi
//   });
  const upsertResult = await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id: event.id,
        vector,
        payload: flat
      }
    ]
  });
  console.log('[upsertEventToQdrant] upsert result:', JSON.stringify(upsertResult, null, 2));
}

// Hàm search event liên quan nhất từ Qdrant
export async function searchEventsQdrant(query: string, topK = 5) {
  const vector = await getEmbeddingOllama(query);
  const result = await qdrant.search(COLLECTION_NAME, {
    vector,
    limit: topK
  });
  return result.map(r => r.payload);
}

// Hàm khởi tạo collection nếu chưa có
export async function initQdrantCollection() {
  const collections = await qdrant.getCollections();
  if (!collections.collections.find((c: any) => c.name === COLLECTION_NAME)) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: EMBEDDING_DIM, distance: 'Cosine' }
    });
  }
}

// Hàm lấy event theo id (dùng points/scroll với filter)
export async function getEventByIdQdrant(eventId: string) {
  const res = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/scroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      limit: 1,
      filter: {
        must: [
          {
            key: 'id',
            match: { value: eventId }
          }
        ]
      },
      with_payload: true
    })
  });
  const data = await res.json();
  return data;
}
