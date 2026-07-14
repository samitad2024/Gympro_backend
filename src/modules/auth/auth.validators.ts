import { z } from "zod";

export const ownerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const memberLoginSchema = z.object({
  phone: z.string().min(1).max(30),
});
