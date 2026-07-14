import { services } from "@db/schema";

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type CreateServiceInput = {
  name: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateServiceInput = Partial<CreateServiceInput>;
