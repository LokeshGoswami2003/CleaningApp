import type { AuthUser, PublicUser } from "../auth/auth.types.js";

export type UpdateUserProfileInput = {
  fullName?: string;
  email?: string | null;
};

export type UsersRepository = {
  findUserById(id: string): Promise<AuthUser | null>;
  findUserByEmail(email: string): Promise<AuthUser | null>;
  updateUserProfile(id: string, input: UpdateUserProfileInput): Promise<AuthUser | null>;
  listUsers(): Promise<AuthUser[]>;
  setUserActive(id: string, isActive: boolean): Promise<AuthUser | null>;
};

export type UserListItem = PublicUser;

