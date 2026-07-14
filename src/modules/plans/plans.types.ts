import { plans } from "@db/schema";

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export type CreatePlanInput = {
  name: string;
  durationDays: number;
  price: string;
};

export type UpdatePlanInput = Partial<CreatePlanInput>;
