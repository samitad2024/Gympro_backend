import {
  pgTable,
  serial,
  integer,
  numeric,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { members } from "./members.schema";

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id")
    .references(() => members.id)
    .notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  methodLabel: varchar("method_label", { length: 50 }).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
