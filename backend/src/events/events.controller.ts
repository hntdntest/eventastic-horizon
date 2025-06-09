import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Event } from './domain/event';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { IsEventCreator } from './decorators/is-event-creator.decorator';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { IsEventCreatorGuard } from './decorators/is-event-creator-guard';

@ApiTags('Events')
@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'events',
  version: '1',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Event,
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Event),
  })
  async findAll(
    @Query() query: FindAllEventsDto,
  ): Promise<InfinityPaginationResponseDto<Event>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.eventsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Event,
  })
  @UseGuards(IsEventCreatorGuard)
  @IsEventCreator()
  findById(@Param('id') id: number) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Event,
  })
  update(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: number) {
    return this.eventsService.remove(id);
  }
}
