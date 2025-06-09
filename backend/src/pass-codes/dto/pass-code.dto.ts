import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PassCodeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
