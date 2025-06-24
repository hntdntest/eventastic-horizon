import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity('ticket_types')
export class TicketType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column({ type: 'date', nullable: true })
  saleStartDate: string;

  @Column({ type: 'date', nullable: true })
  saleEndDate: string;

  @Column({ default: false })
  isEarlyBird: boolean;

  @Column('int', { nullable: true })
  earlyBirdDiscount: number;

  @Column({ default: false })
  isVIP: boolean;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => Event, event => event.ticketTypes, { onDelete: 'CASCADE' })
  event: Event;
}
