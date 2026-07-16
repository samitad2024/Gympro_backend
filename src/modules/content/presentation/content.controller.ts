import { Request, Response } from "express";
import { asyncHandler } from "@core/utils/async-handler";
import { sendSuccess } from "@core/utils/api-response";
import * as contentService from "../application/content.service";

export const listContent = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type as string | undefined;
  const items = await contentService.listContent(type);
  sendSuccess(res, items);
});

export const getDailyQuote = asyncHandler(async (_req: Request, res: Response) => {
  const quote = await contentService.getDailyQuote();
  sendSuccess(res, quote);
});

export const getContent = asyncHandler(async (req: Request, res: Response) => {
  const item = await contentService.getContentById(Number(req.params.id));
  sendSuccess(res, item);
});

export const createContent = asyncHandler(async (req: Request, res: Response) => {
  const item = await contentService.createContent(req.body);
  sendSuccess(res, item, 201);
});

export const updateContent = asyncHandler(async (req: Request, res: Response) => {
  const item = await contentService.updateContent(Number(req.params.id), req.body);
  sendSuccess(res, item);
});

export const deleteContent = asyncHandler(async (req: Request, res: Response) => {
  const item = await contentService.deleteContent(Number(req.params.id));
  sendSuccess(res, item);
});
