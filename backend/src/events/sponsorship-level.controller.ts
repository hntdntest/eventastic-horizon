import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { SponsorshipLevelService } from './sponsorship-level.service';

@Controller('events/:eventId/sponsorship-levels')
export class SponsorshipLevelController {
  constructor(private readonly sponsorshipLevelService: SponsorshipLevelService) {}

  @Get()
  async findAll(@Param('eventId') eventId: string) {
    return this.sponsorshipLevelService.findAll(eventId);
  }

  @Post()
  async create(@Param('eventId') eventId: string, @Body('name') name: string) {
    return this.sponsorshipLevelService.create(eventId, name);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sponsorshipLevelService.remove(id);
  }
}
