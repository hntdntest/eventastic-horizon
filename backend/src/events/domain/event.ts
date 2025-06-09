import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class Event {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  description: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  endTime: Date;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  startTime: Date;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  @Exclude({ toPlainOnly: true })
  user: User;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
