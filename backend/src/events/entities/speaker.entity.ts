import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity('speakers')
export class Speaker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @ManyToOne(() => Event, event => event.speakers, { onDelete: 'CASCADE' })
  event: Event;
}
