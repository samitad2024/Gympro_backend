import { AppError } from "@core/errors/app-error";
import * as plansRepo from "../infrastructure/plans.repository";
import { CreatePlanInput, UpdatePlanInput } from "../domain/plans.types";

export async function listPlans() {
  return plansRepo.findAllPlans();
}

export async function getPlanById(id: number) {
  const plan = await plansRepo.findPlanById(id);
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }
  return plan;
}

export async function createPlan(input: CreatePlanInput) {
  return plansRepo.createPlan(input);
}

export async function updatePlan(id: number, input: UpdatePlanInput) {
  const plan = await plansRepo.updatePlan(id, input);
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }
  return plan;
}

export async function deletePlan(id: number) {
  const plan = await plansRepo.deletePlan(id);
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }
  return plan;
}
