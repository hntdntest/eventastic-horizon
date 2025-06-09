import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FileDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  name: string;
  type: string;
  path: string;
  size: number | 0;
  metadata?: string;
  userId: number;
}
