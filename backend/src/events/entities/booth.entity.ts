import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity('booths')
export class Booth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  company: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @ManyToOne(() => Event, event => event.booths, { onDelete: 'CASCADE' })
  event: Event;
}
