import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { EventDay } from './event-day.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  type: string; // meeting, workshop, exhibit, networking, other

  @Column({ nullable: true })
  location: string;

  @Column('simple-array', { nullable: true })
  speakerIds: string[];

  @ManyToOne(() => EventDay, day => day.activities, { onDelete: 'CASCADE' })
  eventDay: EventDay;
}
