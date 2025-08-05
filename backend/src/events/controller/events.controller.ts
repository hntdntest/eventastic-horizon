import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from "@nestjs/common";
import { EventsService } from "../service/events.service";
import { CreateEventDto } from "../dto/create-event.dto";
import { UpdateEventDto } from "../dto/update-event.dto";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll(
    @Query("page") page = 1,
    @Query("limit") limit = 10,
    @Query("q") q?: string
  ) {
    const result = await this.eventsService.findAllWithPagination({
      paginationOptions: { page: Number(page), limit: Number(limit) },
      search: q,
    });
    return {
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventsService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.eventsService.remove(id);
  }

  @Post('reset')
  async resetEvents() {
    return this.eventsService.resetEvents();
  }

  @Post('seed')
  async seedEvents() {
    return this.eventsService.seedEvents();
  }  
}
