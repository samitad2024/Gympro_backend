import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 120 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
