import jwt from "jsonwebtoken";
import { env } from "@core/config/env";
import { JwtMemberPayload, JwtOwnerPayload } from "@modules/auth/domain/auth.types";

export function signOwnerToken(payload: JwtOwnerPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function signMemberToken(payload: JwtMemberPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken<T>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T;
}
