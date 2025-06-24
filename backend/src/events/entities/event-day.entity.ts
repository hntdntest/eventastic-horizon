import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { Activity } from './activity.entity';

@Entity('event_days')
export class EventDay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => Event, event => event.days, { onDelete: 'CASCADE' })
  event: Event;

  @OneToMany(() => Activity, (activity: Activity) => activity.eventDay, { cascade: true })
  activities: Activity[];
}
