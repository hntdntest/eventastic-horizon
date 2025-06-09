import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'pass_code',
})
export class PassCodeEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: false,
    type: String,
    length: 6,
  })
  pass_code: string;

  @Column({ type: String, unique: true, nullable: false })
  email: string;
}
