import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TabConfigService } from './tab-config.service';

@Controller('tab-configs')
export class TabConfigController {
  constructor(private readonly tabConfigService: TabConfigService) {}

  @Get()
  findAll() {
    return this.tabConfigService.findAll();
  }

  @Post()
  create(@Body() dto: any) {
    return this.tabConfigService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.tabConfigService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tabConfigService.remove(id);
  }
}
