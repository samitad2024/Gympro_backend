import { content } from "@core/database/schema";

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;

export type ContentType = "manual" | "quote";

export type CreateContentInput = {
  type: ContentType;
  title: string;
  body: string;
};

export type UpdateContentInput = Partial<CreateContentInput>;
