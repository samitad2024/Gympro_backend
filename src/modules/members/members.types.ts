import { members } from "@db/schema";

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

export type CreateMemberInput = {
  name: string;
  phone: string;
  planId: number;
  fcmToken?: string;
};

export type UpdateMemberInput = {
  name?: string;
  phone?: string;
  planId?: number;
  fcmToken?: string;
};

export type ConfirmMemberInput = {
  amount: string;
  methodLabel: string;
};

export type ConfirmMemberResult = {
  member: Member;
  payment: {
    id: number;
    memberId: number;
    amount: string;
    methodLabel: string;
    date: Date;
    createdAt: Date;
  };
};
