import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ValueTransformer,
} from "typeorm";
// Multilingual transformer
const MultilingualTransformer: ValueTransformer = {
  to: (value: any) => (value ? JSON.stringify(value) : null),
  from: (value: any) => {
    if (!value) return null;
    try {
      return typeof value === "object" ? value : JSON.parse(value);
    } catch {
      return value;
    }
  },
};
import { Event } from "../../events/entities/event.entity";

@Entity("sponsorship_levels")
export class SponsorshipLevel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", transformer: MultilingualTransformer })
  name: Record<string, string>;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => Event, (event) => event.sponsorshipLevels, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event: Event;

  @Column()
  event_id: string;
}
