import { ApiProperty } from '@nestjs/swagger';

export class PassCode {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  pass_code: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  email: string;

  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
