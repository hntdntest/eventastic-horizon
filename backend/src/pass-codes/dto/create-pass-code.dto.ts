import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  validateOrReject,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePassCodeDto {
  constructor(email: string, pass_code: string) {
    this.email = email;
    this.pass_code = pass_code;
  }

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  pass_code: string;

  static async create(
    email: string,
    pass_code: string,
  ): Promise<CreatePassCodeDto> {
    const instance = new CreatePassCodeDto(email, pass_code);
    await validateOrReject(instance).catch((errors) => {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    });
    return instance;
  }
}
