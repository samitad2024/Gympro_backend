import { AppError } from "@core/errors/app-error";
import { getMemberById } from "@modules/members/application/members.service";
import * as paymentsRepo from "../infrastructure/payments.repository";
import { CreatePaymentInput } from "../domain/payments.types";

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
  const member = await getMemberById(input.memberId);
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
