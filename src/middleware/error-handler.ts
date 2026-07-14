import { Request, Response, NextFunction } from "express";
import { AppError } from "@utils/app-error";
import { sendError } from "@utils/api-response";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  console.error(err);
  return sendError(res, "Internal server error", 500);
}
