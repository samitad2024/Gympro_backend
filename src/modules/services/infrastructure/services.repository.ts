import { eq } from "drizzle-orm";
import { db } from "@core/database/client";
import { services } from "@core/database/schema";
import { NewService } from "../domain/services.types";

export async function findAllServices(activeOnly?: boolean) {
  if (activeOnly) {
    return db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.id);
  }
  return db.select().from(services).orderBy(services.id);
}

export async function findServiceById(id: number) {
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, id));
  return service ?? null;
}

export async function createService(data: NewService) {
  const [service] = await db.insert(services).values(data).returning();
  return service;
}

export async function updateService(id: number, data: Partial<NewService>) {
  const [service] = await db
    .update(services)
    .set(data)
    .where(eq(services.id, id))
    .returning();
  return service ?? null;
}

export async function deleteService(id: number) {
  const [service] = await db
    .delete(services)
    .where(eq(services.id, id))
    .returning();
  return service ?? null;
}
