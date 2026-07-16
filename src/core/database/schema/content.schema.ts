import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
