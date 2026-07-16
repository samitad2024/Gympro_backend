import { eq } from "drizzle-orm";
import { db } from "@core/database/client";
import { payments } from "@core/database/schema";
import { NewPayment } from "../domain/payments.types";

export async function findAllPayments(memberId?: number) {
  if (memberId) {
    return db
      .select()
      .from(payments)
      .where(eq(payments.memberId, memberId))
      .orderBy(payments.date);
  }
  return db.select().from(payments).orderBy(payments.date);
}

export async function findPaymentById(id: number) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id));
  return payment ?? null;
}

export async function createPayment(data: NewPayment) {
  const [payment] = await db.insert(payments).values(data).returning();
  return payment;
}
