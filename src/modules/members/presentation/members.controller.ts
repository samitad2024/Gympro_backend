import { Request, Response } from "express";
import { asyncHandler } from "@core/utils/async-handler";
import { sendSuccess } from "@core/utils/api-response";
import * as membersService from "../application/members.service";

export const listMembers = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const members = await membersService.listMembers(status);
  sendSuccess(res, members);
});

export const listPendingMembers = asyncHandler(
  async (_req: Request, res: Response) => {
    const members = await membersService.listPendingMembers();
    sendSuccess(res, members);
  }
);

export const getMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await membersService.getMemberById(Number(req.params.id));
  sendSuccess(res, member);
});

export const createMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await membersService.createMember(req.body);
  sendSuccess(res, member, 201);
});

export const updateMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await membersService.updateMember(Number(req.params.id), req.body);
  sendSuccess(res, member);
});

export const deleteMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await membersService.deleteMember(Number(req.params.id));
  sendSuccess(res, member);
});

export const confirmMember = asyncHandler(async (req: Request, res: Response) => {
  const result = await membersService.confirmMember(Number(req.params.id), req.body);
  sendSuccess(res, result);
});
