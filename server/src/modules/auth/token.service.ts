import { createHash, randomBytes, randomUUID } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import type { UserRole } from "../../common/constants/roles.js";
import { env } from "../../config/env.js";

const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 15 * 60;
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;

type AccessTokenPayload = {
  userId: string;
  role: UserRole;
};

export class TokenService {
  private readonly accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);

  async createAccessToken(payload: AccessTokenPayload) {
    return new SignJWT({ role: payload.role })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.userId)
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TOKEN_EXPIRES_IN_SECONDS}s`)
      .sign(this.accessSecret);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    const result = await jwtVerify(token, this.accessSecret);
    const userId = result.payload.sub;
    const role = result.payload.role;

    if (!userId || !isUserRole(role)) {
      throw new Error("Invalid token payload");
    }

    return {
      userId,
      role
    };
  }

  createRefreshToken(tokenFamilyId?: string) {
    const token = randomBytes(48).toString("base64url");
    const tokenHash = this.hashRefreshToken(token);
    const familyId = tokenFamilyId ?? randomUUID();
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

    return {
      token,
      tokenHash,
      tokenFamilyId: familyId,
      expiresAt
    };
  }

  hashRefreshToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  get accessTokenExpiresInSeconds() {
    return ACCESS_TOKEN_EXPIRES_IN_SECONDS;
  }
}

function isUserRole(value: unknown): value is UserRole {
  return value === "customer" || value === "provider" || value === "admin" || value === "support";
}
