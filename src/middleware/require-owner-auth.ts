import { Request, Response, NextFunction } from "express";
import { AppError } from "@utils/app-error";
import { verifyToken } from "@utils/jwt";
import { JwtOwnerPayload } from "@modules/auth/auth.types";

export function requireOwnerAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const token = header.slice(7);
    const payload = verifyToken<JwtOwnerPayload>(token);
    if (payload.role !== "owner") {
      return next(new AppError("Forbidden", 403));
    }
    req.user = payload;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
