import { Injectable } from '@nestjs/common';
import { CreatePassCodeDto } from './dto/create-pass-code.dto';
import { UpdatePassCodeDto } from './dto/update-pass-code.dto';
import { PassCodeRepository } from './infrastructure/persistence/pass-code.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { PassCode } from './domain/pass-code';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class PassCodesService {
  constructor(
    // Dependencies here
    private readonly passCodeRepository: PassCodeRepository,
  ) {}

  async create(createPassCodeDto: CreatePassCodeDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.passCodeRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      pass_code: createPassCodeDto.pass_code,

      email: createPassCodeDto.email,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.passCodeRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: PassCode['id']) {
    return this.passCodeRepository.findById(id);
  }

  findByEmail(email: PassCode['email']) {
    return this.passCodeRepository.findByEmail(email);
  }

  findByIds(ids: PassCode['id'][]) {
    return this.passCodeRepository.findByIds(ids);
  }

  async update(
    id: PassCode['id'],
    updatePassCodeDto: UpdatePassCodeDto,
  ): Promise<NullableType<PassCode>> {
    // Do not remove comment below.
    // <updating-property />

    return this.passCodeRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      pass_code: updatePassCodeDto.pass_code,

      email: updatePassCodeDto.email,
    });
  }

  remove(id: PassCode['id']) {
    return this.passCodeRepository.remove(id);
  }
}
