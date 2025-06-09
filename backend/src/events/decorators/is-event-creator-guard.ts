import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_EVENT_CREATOR_KEY } from './is-event-creator.decorator';
import { EventsService } from '../events.service';

@Injectable()
export class IsEventCreatorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly eventService: EventsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const hasEventsRequired = this.reflector.getAllAndOverride<boolean>(
      IS_EVENT_CREATOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!hasEventsRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const id = request.params.id;

    if (!id) {
      console.warn('ID is missing in the request params for HasEventsGuard.');
      return false;
    }

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated.');
    }

    const event = await this.eventService.findByIdAndUserId(id, user.id);

    return !!event;
  }
}
