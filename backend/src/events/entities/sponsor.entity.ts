import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity('sponsors')
export class Sponsor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  level: 'platinum' | 'gold' | 'silver' | 'bronze';

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @ManyToOne(() => Event, event => event.sponsors, { onDelete: 'CASCADE' })
  event: Event;
}
