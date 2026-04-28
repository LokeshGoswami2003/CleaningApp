import bcrypt from "bcryptjs";
import { env } from "../../config/env.js";

const SALT_ROUNDS = env.NODE_ENV === "test" ? 4 : 12;

export class PasswordService {
  async hashPassword(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(password: string, passwordHash: string) {
    return bcrypt.compare(password, passwordHash);
  }
}
