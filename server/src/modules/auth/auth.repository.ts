import { prisma } from "../../database/prisma.js";
import type {
  AuthRepository,
  AuthUser,
  CreateRefreshTokenInput,
  CreateUserInput,
  RefreshTokenRecord
} from "./auth.types.js";

export class PrismaAuthRepository implements AuthRepository {
  async findUserById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user ? toAuthUser(user) : null;
  }

  async findUserByPhone(phone: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { phone }
    });

    return user ? toAuthUser(user) : null;
  }

  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user ? toAuthUser(user) : null;
  }

  async createUser(input: CreateUserInput): Promise<AuthUser> {
    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email ?? null,
        phone: input.phone,
        passwordHash: input.passwordHash,
        role: input.role
      }
    });

    return toAuthUser(user);
  }

  async createRefreshToken(input: CreateRefreshTokenInput): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        tokenFamilyId: input.tokenFamilyId,
        expiresAt: input.expiresAt
      }
    });
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!refreshToken) {
      return null;
    }

    return {
      id: refreshToken.id,
      userId: refreshToken.userId,
      tokenHash: refreshToken.tokenHash,
      tokenFamilyId: refreshToken.tokenFamilyId,
      revokedAt: refreshToken.revokedAt,
      expiresAt: refreshToken.expiresAt,
      user: toAuthUser(refreshToken.user)
    };
  }

  async revokeRefreshToken(id: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt: new Date()
      }
    });
  }

  async revokeRefreshTokenFamily(tokenFamilyId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        tokenFamilyId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }

  async rotateRefreshToken(id: string, input: CreateRefreshTokenInput): Promise<void> {
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id },
        data: {
          revokedAt: new Date(),
          rotatedAt: new Date()
        }
      }),
      prisma.refreshToken.create({
        data: {
          userId: input.userId,
          tokenHash: input.tokenHash,
          tokenFamilyId: input.tokenFamilyId,
          expiresAt: input.expiresAt
        }
      })
    ]);
  }
}

type PrismaUser = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  passwordHash: string;
  role: AuthUser["role"];
  isActive: boolean;
};

function toAuthUser(user: PrismaUser): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    passwordHash: user.passwordHash,
    role: user.role,
    isActive: user.isActive
  };
}
