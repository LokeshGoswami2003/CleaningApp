import type { UserRole } from "../../common/constants/roles.js";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
};

export type PublicUser = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  role: UserRole;
  is_active: boolean;
};

export type CreateUserInput = {
  fullName: string;
  email?: string | null;
  phone: string;
  passwordHash: string;
  role: UserRole;
};

export type CreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  tokenFamilyId: string;
  expiresAt: Date;
};

export type RefreshTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  tokenFamilyId: string;
  revokedAt: Date | null;
  expiresAt: Date;
  user: AuthUser;
};

export type AuthRepository = {
  findUserById(id: string): Promise<AuthUser | null>;
  findUserByPhone(phone: string): Promise<AuthUser | null>;
  findUserByEmail(email: string): Promise<AuthUser | null>;
  createUser(input: CreateUserInput): Promise<AuthUser>;
  createRefreshToken(input: CreateRefreshTokenInput): Promise<void>;
  findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null>;
  revokeRefreshToken(id: string): Promise<void>;
  revokeRefreshTokenFamily(tokenFamilyId: string): Promise<void>;
  rotateRefreshToken(id: string, input: CreateRefreshTokenInput): Promise<void>;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export type AuthResult = {
  user: PublicUser;
  tokens: AuthTokens;
};
