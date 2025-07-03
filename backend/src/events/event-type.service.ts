import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventType } from './event-type.entity';

@Injectable()
export class EventTypeService {
  constructor(
    @InjectRepository(EventType)
    private readonly eventTypeRepo: Repository<EventType>,
  ) {}

  findAll() {
    return this.eventTypeRepo.find();
  }

  findOne(id: string) {
    return this.eventTypeRepo.findOne({ where: { id } });
  }

  create(data: Partial<EventType>) {
    return this.eventTypeRepo.save(data);
  }

  update(id: string, data: Partial<EventType>) {
    return this.eventTypeRepo.update(id, data);
  }

  remove(id: string) {
    return this.eventTypeRepo.delete(id);
  }
}
