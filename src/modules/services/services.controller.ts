import { Request, Response } from "express";
import { asyncHandler } from "@utils/async-handler";
import { sendSuccess } from "@utils/api-response";
import * as servicesService from "./services.service";

export const listServices = asyncHandler(async (req: Request, res: Response) => {
  const activeOnly = String(req.query.activeOnly) === "true";
  const services = await servicesService.listServices(
    activeOnly ? true : undefined
  );
  sendSuccess(res, services);
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
  const service = await servicesService.getServiceById(Number(req.params.id));
  sendSuccess(res, service);
});

export const createService = asyncHandler(async (req: Request, res: Response) => {
  const service = await servicesService.createService(req.body);
  sendSuccess(res, service, 201);
});

export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const service = await servicesService.updateService(Number(req.params.id), req.body);
  sendSuccess(res, service);
});

export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const service = await servicesService.deleteService(Number(req.params.id));
  sendSuccess(res, service);
});
