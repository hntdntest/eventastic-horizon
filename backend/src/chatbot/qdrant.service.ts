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
export async function upsertEventToQdrant(event: any) {
  const text = `${event.title_en || ''} ${event.title_vi || ''} ${event.description_en || ''} ${event.description_vi || ''}`;
  const vector = await getEmbeddingOllama(text);
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id: event.id,
        vector,
        payload: {
          ...event
        }
      }
    ]
  });
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
