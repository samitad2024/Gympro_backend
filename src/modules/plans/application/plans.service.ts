import { AppError } from "@core/errors/app-error";
import { countMembersByPlanId } from "@modules/members/infrastructure/members.repository";
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
  const plan = await plansRepo.findPlanById(id);
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }

  const memberCount = await countMembersByPlanId(id);
  if (memberCount > 0) {
    throw new AppError(
      "Cannot delete plan while members are assigned to it",
      409
    );
  }

  return plansRepo.deletePlan(id);
}
