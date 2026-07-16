import { AppError } from "@core/errors/app-error";
import * as membersRepo from "../infrastructure/members.repository";
import {
  ConfirmMemberInput,
  CreateMemberInput,
  UpdateMemberInput,
} from "../domain/members.types";

export async function listMembers(status?: string) {
  return membersRepo.findAllMembers(status);
}

export async function listPendingMembers() {
  return membersRepo.findPendingMembers();
}

export async function getMemberById(id: number) {
  const member = await membersRepo.findMemberById(id);
  if (!member) {
    throw new AppError("Member not found", 404);
  }
  return member;
}

export async function createMember(input: CreateMemberInput) {
  const existing = await membersRepo.findMemberByPhone(input.phone);
  if (existing) {
    throw new AppError("A member with this phone number already exists", 409);
  }
  return membersRepo.createMember(input);
}

export async function updateMember(id: number, input: UpdateMemberInput) {
  const member = await membersRepo.updateMember(id, input);
  if (!member) {
    throw new AppError("Member not found", 404);
  }
  return member;
}

export async function deleteMember(id: number) {
  const member = await membersRepo.deleteMember(id);
  if (!member) {
    throw new AppError("Member not found", 404);
  }
  return member;
}

export async function confirmMember(id: number, input: ConfirmMemberInput) {
  const member = await membersRepo.findMemberById(id);
  if (!member) {
    throw new AppError("Member not found", 404);
  }
  if (member.status !== "pending") {
    throw new AppError("Only pending members can be confirmed", 400);
  }

  try {
    const result = await membersRepo.confirmMemberTx(
      id,
      input.amount,
      input.methodLabel
    );
    if (!result) {
      throw new AppError("Member not found", 404);
    }
    return result;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      error instanceof Error ? error.message : "Failed to confirm member",
      400
    );
  }
}
