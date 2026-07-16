import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { AppError } from "@core/errors/app-error";

type RequestSchemas = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

function stripEmptyQuery(query: Request["query"]) {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== "" && value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function applyParsedQuery(
  req: Request,
  parsed: Record<string, unknown>
) {
  const query = req.query as Record<string, unknown>;
  for (const key of Object.keys(query)) {
    delete query[key];
  }
  Object.assign(query, parsed);
}

export function validateRequest(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request["params"];
      }
      if (schemas.query) {
        const parsed = schemas.query.parse(
          stripEmptyQuery(req.query)
        ) as Record<string, unknown>;
        applyParsedQuery(req, parsed);
      }
      next();
    } catch (error) {
      const details =
        error instanceof ZodError ? error.flatten() : error;
      next(new AppError("Validation failed", 400, details));
    }
  };
}
