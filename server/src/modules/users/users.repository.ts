import { prisma } from "../../database/prisma.js";
import type { AuthUser } from "../auth/auth.types.js";
import type { UpdateUserProfileInput, UsersRepository } from "./users.types.js";

export class PrismaUsersRepository implements UsersRepository {
  async findUserById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    return user ? toAuthUser(user) : null;
  }

  async findUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user ? toAuthUser(user) : null;
  }

  async updateUserProfile(id: string, input: UpdateUserProfileInput): Promise<AuthUser | null> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        fullName: input.fullName,
        email: input.email
      }
    });

    return toAuthUser(user);
  }

  async listUsers(): Promise<AuthUser[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    });

    return users.map(toAuthUser);
  }

  async setUserActive(id: string, isActive: boolean): Promise<AuthUser | null> {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive }
    });

    return toAuthUser(user);
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

