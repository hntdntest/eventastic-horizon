import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsString,
  IsDate,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here

  Transform,
  Type,
} from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endTime: Date;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startTime: Date;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
