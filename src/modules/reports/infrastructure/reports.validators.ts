import { z } from "zod";
import { monthQuerySchema } from "@core/utils/validators";

export const monthlyReportQuerySchema = z.object({
  month: monthQuerySchema,
});
