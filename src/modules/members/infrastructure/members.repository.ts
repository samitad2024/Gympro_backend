import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@core/database/client";
import { members, plans, payments } from "@core/database/schema";
import { NewMember } from "../domain/members.types";

export async function findAllMembers(status?: string) {
  const query = db.select().from(members);
  if (status) {
    return query.where(eq(members.status, status)).orderBy(members.id);
  }
  return query.orderBy(members.id);
}

export async function findPendingMembers() {
  return db
    .select()
    .from(members)
    .where(eq(members.status, "pending"))
    .orderBy(members.registeredAt);
}

export async function findMemberById(id: number) {
  const [member] = await db.select().from(members).where(eq(members.id, id));
  return member ?? null;
}

export async function findMemberByPhone(phone: string) {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.phone, phone));
  return member ?? null;
}

export async function countMembersByPlanId(planId: number) {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(members)
    .where(eq(members.planId, planId));
  return result?.count ?? 0;
}

export async function expireActiveMembers() {
  const now = new Date();
  return db
    .update(members)
    .set({ status: "expired" })
    .where(and(eq(members.status, "active"), lt(members.endDate, now)))
    .returning({ id: members.id });
}

export async function createMember(data: NewMember) {
  const [member] = await db
    .insert(members)
    .values({ ...data, status: "pending" })
    .returning();
  return member;
}

export async function updateMember(id: number, data: Partial<NewMember>) {
  const [member] = await db
    .update(members)
    .set(data)
    .where(eq(members.id, id))
    .returning();
  return member ?? null;
}

export async function deleteMember(id: number) {
  return db.transaction(async (tx) => {
    await tx.delete(payments).where(eq(payments.memberId, id));

    const [member] = await tx
      .delete(members)
      .where(eq(members.id, id))
      .returning();

    return member ?? null;
  });
}

export async function confirmMemberTx(
  id: number,
  amount: string,
  methodLabel: string
) {
  return db.transaction(async (tx) => {
    const [member] = await tx.select().from(members).where(eq(members.id, id));
    if (!member) {
      return null;
    }

    if (!member.planId) {
      throw new Error("Member has no plan assigned");
    }

    const [plan] = await tx
      .select()
      .from(plans)
      .where(eq(plans.id, member.planId));

    if (!plan) {
      throw new Error("Plan not found");
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const [updatedMember] = await tx
      .update(members)
      .set({ status: "active", startDate, endDate })
      .where(eq(members.id, id))
      .returning();

    const [payment] = await tx
      .insert(payments)
      .values({ memberId: id, amount, methodLabel, date: new Date() })
      .returning();

    return { member: updatedMember, payment };
  });
}
