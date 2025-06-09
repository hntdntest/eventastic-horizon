import { PassCode } from '../../../../domain/pass-code';

import { PassCodeEntity } from '../entities/pass-code.entity';

export class PassCodeMapper {
  static toDomain(raw: PassCodeEntity): PassCode {
    const domainEntity = new PassCode();
    domainEntity.pass_code = raw.pass_code;

    domainEntity.email = raw.email;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: PassCode): PassCodeEntity {
    const persistenceEntity = new PassCodeEntity();
    persistenceEntity.pass_code = domainEntity.pass_code;

    persistenceEntity.email = domainEntity.email;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
