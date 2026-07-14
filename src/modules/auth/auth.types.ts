export type OwnerLoginInput = {
  email: string;
  password: string;
};

export type MemberLoginInput = {
  phone: string;
};

export type AuthTokenResponse = {
  token: string;
};

export type MemberAuthResponse = AuthTokenResponse & {
  member: {
    id: number;
    name: string;
    phone: string;
    status: string;
  };
};

export type JwtOwnerPayload = {
  sub: number;
  role: "owner";
};

export type JwtMemberPayload = {
  sub: number;
  role: "member";
};
