import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SponsorshipLevel } from './entities/sponsorship-level.entity';

@Injectable()
export class SponsorshipLevelService {
  constructor(
    @InjectRepository(SponsorshipLevel)
    private sponsorshipLevelRepo: Repository<SponsorshipLevel>,
  ) {}

  async findAll(eventId: string) {
    return this.sponsorshipLevelRepo.find({ where: { event_id: eventId }, order: { sortOrder: 'ASC' } });
  }

  async create(eventId: string, name: string) {
    const level = this.sponsorshipLevelRepo.create({ event_id: eventId, name });
    return this.sponsorshipLevelRepo.save(level);
  }

  async remove(id: string) {
    return this.sponsorshipLevelRepo.delete(id);
  }
}
