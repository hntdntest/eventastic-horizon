import { UsersModule } from '../users/users.module';
import {
  // common
  Module,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { RelationalEventPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // import modules, etc.
    RelationalEventPersistenceModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, RelationalEventPersistenceModule],
})
export class EventsModule {}
