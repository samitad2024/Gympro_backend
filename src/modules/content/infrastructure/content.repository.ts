import { eq } from "drizzle-orm";
import { db } from "@core/database/client";
import { content } from "@core/database/schema";
import { NewContent } from "../domain/content.types";

export async function findAllContent(type?: string) {
  if (type) {
    return db
      .select()
      .from(content)
      .where(eq(content.type, type))
      .orderBy(content.id);
  }
  return db.select().from(content).orderBy(content.id);
}

export async function findContentById(id: number) {
  const [item] = await db.select().from(content).where(eq(content.id, id));
  return item ?? null;
}

export async function createContent(data: NewContent) {
  const [item] = await db.insert(content).values(data).returning();
  return item;
}

export async function updateContent(id: number, data: Partial<NewContent>) {
  const [item] = await db
    .update(content)
    .set(data)
    .where(eq(content.id, id))
    .returning();
  return item ?? null;
}

export async function deleteContent(id: number) {
  const [item] = await db.delete(content).where(eq(content.id, id)).returning();
  return item ?? null;
}

export async function findDailyQuote() {
  const quotes = await db
    .select()
    .from(content)
    .where(eq(content.type, "quote"));
  if (quotes.length === 0) {
    return null;
  }
  const dayIndex = new Date().getDate() % quotes.length;
  return quotes[dayIndex];
}
