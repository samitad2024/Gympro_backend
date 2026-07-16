import { JwtMemberPayload, JwtOwnerPayload } from "@modules/auth/domain/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JwtOwnerPayload | JwtMemberPayload;
    }
  }
}

export {};
