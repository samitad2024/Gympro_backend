import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { plans } from "./plans.schema";

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull().unique(),
  planId: integer("plan_id").references(() => plans.id),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  fcmToken: varchar("fcm_token", { length: 255 }),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});
