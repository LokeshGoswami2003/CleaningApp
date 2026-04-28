import { randomUUID } from "node:crypto";
import type {
  AuthRepository,
  AuthUser,
  CreateRefreshTokenInput,
  CreateUserInput,
  RefreshTokenRecord
} from "./auth.types.js";

export class InMemoryAuthRepository implements AuthRepository {
  private readonly users = new Map<string, AuthUser>();
  private readonly refreshTokens = new Map<string, RefreshTokenRecord>();

  async findUserById(id: string): Promise<AuthUser | null> {
    return this.users.get(id) ?? null;
  }

  async findUserByPhone(phone: string): Promise<AuthUser | null> {
    return Array.from(this.users.values()).find((user) => user.phone === phone) ?? null;
  }

  async findUserByEmail(email: string): Promise<AuthUser | null> {
    return Array.from(this.users.values()).find((user) => user.email === email) ?? null;
  }

  async createUser(input: CreateUserInput): Promise<AuthUser> {
    const duplicatePhone = await this.findUserByPhone(input.phone);

    if (duplicatePhone) {
      throw new Error("Duplicate phone");
    }

    if (input.email) {
      const duplicateEmail = await this.findUserByEmail(input.email);

      if (duplicateEmail) {
        throw new Error("Duplicate email");
      }
    }

    const user: AuthUser = {
      id: randomUUID(),
      fullName: input.fullName,
      email: input.email ?? null,
      phone: input.phone,
      passwordHash: input.passwordHash,
      role: input.role,
      isActive: true
    };

    this.users.set(user.id, user);
    return user;
  }

  async createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {
    const user = this.users.get(input.userId);

    if (!user) {
      throw new Error("User not found");
    }

    this.refreshTokens.set(input.tokenHash, {
      id: randomUUID(),
      userId: input.userId,
      tokenHash: input.tokenHash,
      tokenFamilyId: input.tokenFamilyId,
      revokedAt: null,
      expiresAt: input.expiresAt,
      user
    });
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    return this.refreshTokens.get(tokenHash) ?? null;
  }

  async revokeRefreshToken(id: string): Promise<void> {
    const refreshToken = Array.from(this.refreshTokens.values()).find((token) => token.id === id);

    if (refreshToken) {
      refreshToken.revokedAt = new Date();
    }
  }

  async revokeRefreshTokenFamily(tokenFamilyId: string): Promise<void> {
    for (const refreshToken of this.refreshTokens.values()) {
      if (refreshToken.tokenFamilyId === tokenFamilyId && !refreshToken.revokedAt) {
        refreshToken.revokedAt = new Date();
      }
    }
  }

  async rotateRefreshToken(id: string, input: CreateRefreshTokenInput): Promise<void> {
    await this.revokeRefreshToken(id);
    await this.createRefreshToken(input);
  }

  getRefreshTokenCount() {
    return this.refreshTokens.size;
  }

  async updateUserProfile(id: string, input: { fullName?: string; email?: string | null }): Promise<AuthUser | null> {
    const user = this.users.get(id);

    if (!user) {
      return null;
    }

    if (input.email && input.email !== user.email) {
      const duplicateEmail = await this.findUserByEmail(input.email);

      if (duplicateEmail) {
        throw new Error("Duplicate email");
      }
    }

    const updatedUser = {
      ...user,
      fullName: input.fullName ?? user.fullName,
      email: input.email === undefined ? user.email : input.email
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async listUsers(): Promise<AuthUser[]> {
    return Array.from(this.users.values());
  }

  async setUserActive(id: string, isActive: boolean): Promise<AuthUser | null> {
    const user = this.users.get(id);

    if (!user) {
      return null;
    }

    const updatedUser = {
      ...user,
      isActive
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }
}
