import { eq } from "drizzle-orm";
import { db } from "@core/database/client";
import { owners } from "@core/database/schema";
import { findMemberByPhone } from "@modules/members/infrastructure/members.repository";

export async function findOwnerByEmail(email: string) {
  const [owner] = await db
    .select()
    .from(owners)
    .where(eq(owners.email, email));
  return owner ?? null;
}

export async function createOwner(email: string, passwordHash: string) {
  const [owner] = await db
    .insert(owners)
    .values({ email, passwordHash })
    .returning();
  return owner;
}

export async function findMemberByPhoneForAuth(phone: string) {
  return findMemberByPhone(phone);
}
