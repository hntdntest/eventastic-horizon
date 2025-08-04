import { upsertEventToQdrant, initQdrantCollection } from './qdrant.service';
import { AppDataSource } from '../database/data-source';
import { Event } from '../events/entities/event.entity';

async function main() {
  await AppDataSource.initialize();
  await initQdrantCollection();
  const eventRepo = AppDataSource.getRepository(Event);
  const events = await eventRepo.find();
  console.log(`Found ${events.length} events. Indexing to Qdrant...`);
  for (const event of events) {
    try {
      await upsertEventToQdrant(event);
      console.log(`Indexed event ${event.id}`);
    } catch (e) {
      console.error(`Error indexing event ${event.id}:`, e);
    }
  }
  console.log('Done.');
  process.exit(0);
}

main();
