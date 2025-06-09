import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Event } from '../../domain/event';

export abstract class EventRepository {
  abstract create(
    data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Event>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Event[]>;

  abstract findById(id: Event['id']): Promise<NullableType<Event>>;

  abstract findByIdAndUserId(
    id: Event['id'],
    userId: number,
  ): Promise<NullableType<Event>>;

  abstract findByIds(ids: Event['id'][]): Promise<Event[]>;

  abstract update(
    id: Event['id'],
    payload: DeepPartial<Event>,
  ): Promise<Event | null>;

  abstract remove(id: Event['id']): Promise<void>;
}
