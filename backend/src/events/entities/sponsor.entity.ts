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

@Entity("sponsors")
export class Sponsor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", transformer: MultilingualTransformer })
  name: Record<string, string>;

  @Column({ type: "text", transformer: MultilingualTransformer })
  level: Record<string, string>;

  @Column({ nullable: true })
  website: string;

  @Column({
    type: "text",
    transformer: MultilingualTransformer,
    nullable: true,
  })
  description: Record<string, string>;

  @Column({ nullable: true })
  logoUrl: string;

  @ManyToOne(() => Event, (event) => event.sponsors, { onDelete: "CASCADE" })
  event: Event;
}
