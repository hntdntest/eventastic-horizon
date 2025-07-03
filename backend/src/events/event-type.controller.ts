import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { EventTypeService } from './event-type.service';

@Controller('event-types')
export class EventTypeController {
  constructor(private readonly eventTypeService: EventTypeService) {}

  @Get()
  findAll() {
    return this.eventTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventTypeService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.eventTypeService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.eventTypeService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventTypeService.remove(id);
  }
}
