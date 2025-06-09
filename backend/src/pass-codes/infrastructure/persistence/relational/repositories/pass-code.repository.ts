import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PassCodeEntity } from '../entities/pass-code.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PassCode } from '../../../../domain/pass-code';
import { PassCodeRepository } from '../../pass-code.repository';
import { PassCodeMapper } from '../mappers/pass-code.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PassCodeRelationalRepository implements PassCodeRepository {
  constructor(
    @InjectRepository(PassCodeEntity)
    private readonly passCodeRepository: Repository<PassCodeEntity>,
  ) {}

  async create(data: PassCode): Promise<PassCode> {
    const persistenceModel = PassCodeMapper.toPersistence(data);
    const newEntity = await this.passCodeRepository.save(
      this.passCodeRepository.create(persistenceModel),
    );
    return PassCodeMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PassCode[]> {
    const entities = await this.passCodeRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PassCodeMapper.toDomain(entity));
  }

  async findById(id: PassCode['id']): Promise<NullableType<PassCode>> {
    const entity = await this.passCodeRepository.findOne({
      where: { id },
    });

    return entity ? PassCodeMapper.toDomain(entity) : null;
  }

  async findByEmail(email: PassCode['email']): Promise<NullableType<PassCode>> {
    const entity = await this.passCodeRepository.findOne({
      where: { email },
    });

    return entity ? PassCodeMapper.toDomain(entity) : null;
  }

  async findByIds(ids: PassCode['id'][]): Promise<PassCode[]> {
    const entities = await this.passCodeRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PassCodeMapper.toDomain(entity));
  }

  async update(
    id: PassCode['id'],
    payload: Partial<PassCode>,
  ): Promise<PassCode> {
    const entity = await this.passCodeRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.passCodeRepository.save(
      this.passCodeRepository.create(
        PassCodeMapper.toPersistence({
          ...PassCodeMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PassCodeMapper.toDomain(updatedEntity);
  }

  async remove(id: PassCode['id']): Promise<void> {
    await this.passCodeRepository.delete(id);
  }
}
