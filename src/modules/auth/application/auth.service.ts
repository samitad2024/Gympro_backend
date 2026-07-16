import bcrypt from "bcryptjs";
import { env } from "@core/config/env";
import { AppError } from "@core/errors/app-error";
import { signMemberToken, signOwnerToken } from "@core/utils/jwt";
import * as authRepo from "../infrastructure/auth.repository";
import {
  MemberAuthResponse,
  MemberLoginInput,
  OwnerLoginInput,
} from "../domain/auth.types";

export async function ensureOwnerExists() {
  const existing = await authRepo.findOwnerByEmail(env.OWNER_EMAIL);
  if (existing) {
    return existing;
  }
  const passwordHash = await bcrypt.hash(env.OWNER_PASSWORD, 10);
  return authRepo.createOwner(env.OWNER_EMAIL, passwordHash);
}

export async function ownerLogin(
  input: OwnerLoginInput
): Promise<{ token: string }> {
  await ensureOwnerExists();
  const owner = await authRepo.findOwnerByEmail(input.email);
  if (!owner) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await bcrypt.compare(input.password, owner.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signOwnerToken({ sub: owner.id, role: "owner" });
  return { token };
}

export async function memberLogin(
  input: MemberLoginInput
): Promise<MemberAuthResponse> {
  const member = await authRepo.findMemberByPhoneForAuth(input.phone);
  if (!member) {
    throw new AppError("Member not found", 404);
  }

  const token = signMemberToken({ sub: member.id, role: "member" });
  return {
    token,
    member: {
      id: member.id,
      name: member.name,
      phone: member.phone,
      status: member.status,
    },
  };
}
