import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TabConfig } from './tab-config.entity';

@Injectable()
export class TabConfigService {
  constructor(
    @InjectRepository(TabConfig)
    private readonly repo: Repository<TabConfig>,
  ) {}

  findAll() {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  create(dto: Partial<TabConfig>) {
    return this.repo.save(dto);
  }

  update(id: string, dto: Partial<TabConfig>) {
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
