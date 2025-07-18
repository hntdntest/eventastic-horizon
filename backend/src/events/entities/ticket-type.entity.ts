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

@Entity("ticket_types")
export class TicketType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", transformer: MultilingualTransformer })
  name: Record<string, string>;

  @Column({
    type: "text",
    transformer: MultilingualTransformer,
    nullable: true,
  })
  description: Record<string, string>;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("int")
  quantity: number;

  @Column({ type: "date", nullable: true })
  saleStartDate: string;

  @Column({ type: "date", nullable: true })
  saleEndDate: string;

  @Column({ default: false })
  isEarlyBird: boolean;

  @Column("int", { nullable: true })
  earlyBirdDiscount: number;

  @Column({ default: false })
  isVIP: boolean;

  @Column({
    type: "text",
    transformer: MultilingualTransformer,
    nullable: true,
  })
  category: Record<string, string>;

  @ManyToOne(() => Event, (event) => event.ticketTypes, { onDelete: "CASCADE" })
  event: Event;
}
