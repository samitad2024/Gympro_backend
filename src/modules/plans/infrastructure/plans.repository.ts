import { eq } from "drizzle-orm";
import { db } from "@core/database/client";
import { plans } from "@core/database/schema";
import { NewPlan } from "../domain/plans.types";

export async function findAllPlans() {
  return db.select().from(plans).orderBy(plans.id);
}

export async function findPlanById(id: number) {
  const [plan] = await db.select().from(plans).where(eq(plans.id, id));
  return plan ?? null;
}

export async function createPlan(data: NewPlan) {
  const [plan] = await db.insert(plans).values(data).returning();
  return plan;
}

export async function updatePlan(id: number, data: Partial<NewPlan>) {
  const [plan] = await db
    .update(plans)
    .set(data)
    .where(eq(plans.id, id))
    .returning();
  return plan ?? null;
}

export async function deletePlan(id: number) {
  const [plan] = await db.delete(plans).where(eq(plans.id, id)).returning();
  return plan ?? null;
}
