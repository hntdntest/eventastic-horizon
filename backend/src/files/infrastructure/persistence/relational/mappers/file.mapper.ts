import { File } from '../../../../domain/file';
import { FileEntity } from '../entities/file.entity';
import { FileDto } from '../../../../dto/file.dto';

export class FileMapper {
  static toDomain(raw: FileEntity): File {
    const domainEntity = new File();
    domainEntity.id = raw.id;
    domainEntity.path = raw.path;
    return domainEntity;
  }

  static toPersistence(domainEntity: Omit<FileDto, 'id'>): FileEntity {
    const persistenceEntity = new FileEntity();
    persistenceEntity.path = domainEntity.path;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.size = domainEntity.size;
    persistenceEntity.type = domainEntity.type;
    persistenceEntity.userId = domainEntity.userId;
    if (domainEntity.metadata) {
      persistenceEntity.metadata = domainEntity.metadata;
    }
    return persistenceEntity;
  }
}
