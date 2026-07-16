import { AppError } from "@core/errors/app-error";
import * as contentRepo from "../infrastructure/content.repository";
import { CreateContentInput, UpdateContentInput } from "../domain/content.types";

export async function listContent(type?: string) {
  return contentRepo.findAllContent(type);
}

export async function getContentById(id: number) {
  const item = await contentRepo.findContentById(id);
  if (!item) {
    throw new AppError("Content not found", 404);
  }
  return item;
}

export async function getDailyQuote() {
  const quote = await contentRepo.findDailyQuote();
  if (!quote) {
    throw new AppError("No quotes available", 404);
  }
  return quote;
}

export async function createContent(input: CreateContentInput) {
  return contentRepo.createContent(input);
}

export async function updateContent(id: number, input: UpdateContentInput) {
  const item = await contentRepo.updateContent(id, input);
  if (!item) {
    throw new AppError("Content not found", 404);
  }
  return item;
}

export async function deleteContent(id: number) {
  const item = await contentRepo.deleteContent(id);
  if (!item) {
    throw new AppError("Content not found", 404);
  }
  return item;
}
