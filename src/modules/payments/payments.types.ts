import { payments } from "@db/schema";

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type CreatePaymentInput = {
  memberId: number;
  amount: string;
  methodLabel: string;
  date?: string;
};
