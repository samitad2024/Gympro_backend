import { AppError } from "@utils/app-error";
import { findMemberById } from "@modules/members/members.repository";
import * as paymentsRepo from "./payments.repository";
import { CreatePaymentInput } from "./payments.types";

export async function listPayments(memberId?: number) {
  return paymentsRepo.findAllPayments(memberId);
}

export async function getPaymentById(id: number) {
  const payment = await paymentsRepo.findPaymentById(id);
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }
  return payment;
}

export async function createManualPayment(input: CreatePaymentInput) {
  const member = await findMemberById(input.memberId);
  if (!member) {
    throw new AppError("Member not found", 404);
  }
  if (member.status !== "active") {
    throw new AppError("Payments can only be added for active members", 400);
  }

  return paymentsRepo.createPayment({
    memberId: input.memberId,
    amount: input.amount,
    methodLabel: input.methodLabel,
    date: input.date ? new Date(input.date) : new Date(),
  });
}
