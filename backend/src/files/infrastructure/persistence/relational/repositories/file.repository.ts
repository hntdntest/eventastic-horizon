import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { In, Repository } from 'typeorm';
import { FileRepository } from '../../file.repository';

import { FileMapper } from '../mappers/file.mapper';
import { File } from '../../../../domain/file';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FileDto } from '../../../../dto/file.dto';

@Injectable()
export class FileRelationalRepository implements FileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(data: Omit<FileDto, 'id'>): Promise<File> {
    return this.fileRepository.save(this.fileRepository.create(data));
  }

  async findById(id: File['id']): Promise<NullableType<File>> {
    const entity = await this.fileRepository.findOne({
      where: {
        id: id,
      },
    });

    return entity ? FileMapper.toDomain(entity) : null;
  }

  async findByIds(ids: File['id'][]): Promise<File[]> {
    const entities = await this.fileRepository.find({
      where: {
        id: In(ids),
      },
    });

    return entities.map((entity) => FileMapper.toDomain(entity));
  }
}
