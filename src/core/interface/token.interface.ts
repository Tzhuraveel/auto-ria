import { Roles } from '@prisma/client';

export interface ITokenPair {
  accessToken: string;
}

export interface ITokenPayload {
  id: string;
  role: Roles;
}
