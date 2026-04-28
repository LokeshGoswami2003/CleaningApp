import { AppError } from "../../common/errors/app-error.js";
import type { AuthUser, PublicUser } from "../auth/auth.types.js";
import type { UpdateMyProfileInput } from "./users.schemas.js";
import type { UsersRepository } from "./users.types.js";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getMe(user: AuthUser) {
    return this.toPublicUser(user);
  }

  async updateMe(user: AuthUser, input: UpdateMyProfileInput) {
    if (input.email && input.email !== user.email) {
      const existingUser = await this.usersRepository.findUserByEmail(input.email);

      if (existingUser) {
        throw new AppError(409, "USER_EMAIL_ALREADY_REGISTERED", "Email is already registered.");
      }
    }

    const updatedUser = await this.usersRepository.updateUserProfile(user.id, {
      fullName: input.full_name,
      email: input.email
    });

    if (!updatedUser) {
      throw new AppError(404, "USER_NOT_FOUND", "User was not found.");
    }

    return this.toPublicUser(updatedUser);
  }

  async listUsers() {
    const users = await this.usersRepository.listUsers();

    return users.map((user) => this.toPublicUser(user));
  }

  async setUserStatus(id: string, isActive: boolean) {
    const user = await this.usersRepository.setUserActive(id, isActive);

    if (!user) {
      throw new AppError(404, "USER_NOT_FOUND", "User was not found.");
    }

    return this.toPublicUser(user);
  }

  private toPublicUser(user: AuthUser): PublicUser {
    return {
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.isActive
    };
  }
}

