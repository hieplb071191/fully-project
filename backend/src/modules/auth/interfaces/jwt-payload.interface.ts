import { SourceLoginEnum } from '../../../common/enum/source-login.enum';

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  isTwoFa: boolean;
  loginAt: Date | null;
  bannedAt: Date | null;
  isConfirm: boolean;
  sourceLogin: SourceLoginEnum;
  avatar: string;
}

export interface AuthenticatedUser {
  userId: number;
  username: string;
  email: string;
  isTwoFa: boolean;
  loginAt: Date | null;
  bannedAt: Date | null;
  isConfirm: boolean;
  sourceLogin: SourceLoginEnum;
  avatar: string;
}
