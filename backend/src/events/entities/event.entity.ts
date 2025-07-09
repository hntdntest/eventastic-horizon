import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Speaker } from './speaker.entity'; // Đường dẫn tới file định nghĩa entity Speaker
import { Sponsor } from './sponsor.entity';
import { Booth } from './booth.entity';
import { TicketType } from './ticket-type.entity';
import { EventDay } from './event-day.entity';
import { SponsorshipLevel } from './sponsorship-level.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column()
  location: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'boolean', default: true })
  isFreeEvent: boolean;

  @Column('simple-array', { nullable: true })
  media?: string[];

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ type: 'json', nullable: true })
  tabConfig?: Record<string, boolean>;

  @Column({ nullable: true })
  eventType?: string;

  @OneToMany(() => Speaker, speaker => speaker.event, { cascade: true })
  speakers: Speaker[];

  @OneToMany(() => Sponsor, sponsor => sponsor.event, { cascade: true })
  sponsors: Sponsor[];

  @OneToMany(() => Booth, booth => booth.event, { cascade: true })
  booths: Booth[];

  @OneToMany(() => TicketType, ticketType => ticketType.event, { cascade: true })
  ticketTypes: TicketType[];

  @OneToMany(() => EventDay, day => day.event, { cascade: true })
  days: EventDay[];

  @OneToMany(() => SponsorshipLevel, sponsorshipLevel => sponsorshipLevel.event)
  sponsorshipLevels: SponsorshipLevel[];

  // Ticket categories are now stored directly in the event table
  @Column({ type: "simple-array", nullable: true })
  ticketCategories?: string[];
}
