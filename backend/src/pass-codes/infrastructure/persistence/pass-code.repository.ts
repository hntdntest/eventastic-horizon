import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PassCode } from '../../domain/pass-code';

export abstract class PassCodeRepository {
  abstract create(
    data: Omit<PassCode, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PassCode>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PassCode[]>;

  abstract findById(id: PassCode['id']): Promise<NullableType<PassCode>>;

  abstract findByIds(ids: PassCode['id'][]): Promise<PassCode[]>;

  abstract update(
    id: PassCode['id'],
    payload: DeepPartial<PassCode>,
  ): Promise<PassCode | null>;

  abstract remove(id: PassCode['id']): Promise<void>;

  abstract findByEmail(
    email: PassCode['email'],
  ): Promise<NullableType<PassCode>>;
}
