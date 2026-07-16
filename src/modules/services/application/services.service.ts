import { AppError } from "@core/errors/app-error";
import * as servicesRepo from "../infrastructure/services.repository";
import { CreateServiceInput, UpdateServiceInput } from "../domain/services.types";

export async function listServices(activeOnly?: boolean) {
  return servicesRepo.findAllServices(activeOnly);
}

export async function getServiceById(id: number) {
  const service = await servicesRepo.findServiceById(id);
  if (!service) {
    throw new AppError("Service not found", 404);
  }
  return service;
}

export async function createService(input: CreateServiceInput) {
  return servicesRepo.createService(input);
}

export async function updateService(id: number, input: UpdateServiceInput) {
  const service = await servicesRepo.updateService(id, input);
  if (!service) {
    throw new AppError("Service not found", 404);
  }
  return service;
}

export async function deleteService(id: number) {
  const service = await servicesRepo.deleteService(id);
  if (!service) {
    throw new AppError("Service not found", 404);
  }
  return service;
}
