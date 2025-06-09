import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventRepository } from './infrastructure/persistence/event.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Event } from './domain/event';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly userService: UsersService,
    private readonly eventRepository: EventRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const userObject = await this.userService.findById(createEventDto.user.id);
    if (!userObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'notExists',
        },
      });
    }
    const user = userObject;

    return this.eventRepository.create({
      user,

      description: createEventDto.description,

      endTime: createEventDto.endTime,

      startTime: createEventDto.startTime,

      name: createEventDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.eventRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  async findById(id: Event['id']) {
    await this.firebaseService.testFirebaseDB();
    return this.eventRepository.findById(id);
  }

  findByIdAndUserId(id: Event['id'], userId: number) {
    return this.eventRepository.findByIdAndUserId(id, userId);
  }

  findByIds(ids: Event['id'][]) {
    return this.eventRepository.findByIds(ids);
  }

  async update(id: Event['id'], updateEventDto: UpdateEventDto) {
    let user: User | undefined = undefined;

    if (updateEventDto.user) {
      const userObject = await this.userService.findById(
        updateEventDto.user.id,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            user: 'notExists',
          },
        });
      }
      user = userObject;
    }

    return this.eventRepository.update(id, {
      user,

      description: updateEventDto.description,

      endTime: updateEventDto.endTime,

      startTime: updateEventDto.startTime,

      name: updateEventDto.name,
    });
  }

  remove(id: Event['id']) {
    return this.eventRepository.remove(id);
  }
}
