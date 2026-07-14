import { eq } from "drizzle-orm";
import { db } from "@db/client";
import { owners } from "@db/schema";
import { findMemberByPhone } from "@modules/members/members.repository";

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
