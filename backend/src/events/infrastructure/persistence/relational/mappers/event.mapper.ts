import { Event } from '../../../../domain/event';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { EventEntity } from '../entities/event.entity';

export class EventMapper {
  static toDomain(raw: EventEntity): Event {
    const domainEntity = new Event();
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.description = raw.description;

    domainEntity.endTime = raw.endTime;

    domainEntity.startTime = raw.startTime;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Event): EventEntity {
    const persistenceEntity = new EventEntity();
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.endTime = domainEntity.endTime;

    persistenceEntity.startTime = domainEntity.startTime;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
