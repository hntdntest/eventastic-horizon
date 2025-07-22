import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event_types')
export class EventType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // Danh sách tab key liên quan đến event type này
  @Column('simple-json')
  tabs: string[];
}
