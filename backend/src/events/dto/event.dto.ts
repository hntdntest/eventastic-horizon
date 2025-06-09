import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class EventDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
