import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  durationDays: integer("duration_days").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
