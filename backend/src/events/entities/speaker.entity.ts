import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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
import { Event } from "./event.entity";

@Entity("speakers")
export class Speaker {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", transformer: MultilingualTransformer })
  name: Record<string, string>;

  @Column({ type: "text", transformer: MultilingualTransformer })
  title: Record<string, string>;

  @Column({
    type: "text",
    transformer: MultilingualTransformer,
    nullable: true,
  })
  bio: Record<string, string>;

  @Column({ nullable: true })
  avatarUrl: string;

  @ManyToOne(() => Event, (event) => event.speakers, { onDelete: "CASCADE" })
  event: Event;
}
