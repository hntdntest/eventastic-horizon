import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
// Transformer cho các trường đa ngôn ngữ (object <-> string)
const MultilingualTransformer = {
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
import { EventDay } from "./event-day.entity";

@Entity("activities")
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", transformer: MultilingualTransformer })
  title: Record<string, string>;

  @Column({
    type: "text",
    transformer: MultilingualTransformer,
    nullable: true,
  })
  description: Record<string, string>;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  type: string; // meeting, workshop, exhibit, networking, other

  @Column({ nullable: true })
  location: string;

  @Column("simple-array", { nullable: true })
  speakerIds: string[];

  @ManyToOne(() => EventDay, (day) => day.activities, { onDelete: "CASCADE" })
  eventDay: EventDay;
}
