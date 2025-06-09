import { NullableType } from '../../../utils/types/nullable.type';
import { File } from '../../domain/file';
import { FileDto } from '../../dto/file.dto';

export abstract class FileRepository {
  abstract create(data: Omit<FileDto, 'id'>): Promise<File>;

  abstract findById(id: File['id']): Promise<NullableType<File>>;

  abstract findByIds(ids: File['id'][]): Promise<File[]>;
}
