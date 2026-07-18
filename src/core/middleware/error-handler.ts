import { Request, Response, NextFunction } from "express";
import { AppError } from "@core/errors/app-error";
import { sendError } from "@core/utils/api-response";
import { mapDatabaseError } from "@core/utils/db-error";
import { env } from "@core/config/env";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  const dbError = mapDatabaseError(err);
  if (dbError) {
    return sendError(res, dbError.message, dbError.statusCode, dbError.errors);
  }

  if (env.NODE_ENV !== "production") {
    console.error(err);
  } else {
    console.error(err.message);
  }

  return sendError(res, "Internal server error", 500);
}
