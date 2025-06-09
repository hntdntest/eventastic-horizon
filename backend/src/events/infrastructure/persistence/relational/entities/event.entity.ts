import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'event',
})
export class EventEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { eager: false, nullable: false })
  user: UserEntity;

  @Column({
    nullable: false,
    type: String,
  })
  description: string;

  @Column({
    nullable: false,
    type: Date,
  })
  endTime: Date;

  @Column({
    nullable: false,
    type: Date,
  })
  startTime: Date;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
