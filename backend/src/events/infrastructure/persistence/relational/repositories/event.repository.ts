import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EventEntity } from '../entities/event.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Event } from '../../../../domain/event';
import { EventRepository } from '../../event.repository';
import { EventMapper } from '../mappers/event.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class EventRelationalRepository implements EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async create(data: Event): Promise<Event> {
    const persistenceModel = EventMapper.toPersistence(data);
    const newEntity = await this.eventRepository.save(
      this.eventRepository.create(persistenceModel),
    );
    return EventMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Event[]> {
    const entities = await this.eventRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => EventMapper.toDomain(entity));
  }

  async findById(id: Event['id']): Promise<NullableType<Event>> {
    const entity = await this.eventRepository.findOne({
      where: { id },
    });

    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findByIdAndUserId(
    id: Event['id'],
    userId: number,
  ): Promise<NullableType<Event>> {
    const entity = await this.eventRepository.findOne({
      where: { id, user: { id: userId } },
    });
    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Event['id'][]): Promise<Event[]> {
    const entities = await this.eventRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => EventMapper.toDomain(entity));
  }

  async update(id: Event['id'], payload: Partial<Event>): Promise<Event> {
    const entity = await this.eventRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.eventRepository.save(
      this.eventRepository.create(
        EventMapper.toPersistence({
          ...EventMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EventMapper.toDomain(updatedEntity);
  }

  async remove(id: Event['id']): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
