import { SetMetadata } from '@nestjs/common';

export const IS_EVENT_CREATOR_KEY = 'isEventCreator';

export const IsEventCreator = () => SetMetadata(IS_EVENT_CREATOR_KEY, true);
