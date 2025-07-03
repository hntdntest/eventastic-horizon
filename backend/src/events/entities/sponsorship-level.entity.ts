import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity('sponsorship_levels')
export class SponsorshipLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Event, event => event.sponsorshipLevels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  event_id: string;
}
