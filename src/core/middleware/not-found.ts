import { Request, Response } from "express";
import { sendError } from "@core/utils/api-response";

export function notFound(_req: Request, res: Response) {
  return sendError(res, "Route not found", 404);
}
