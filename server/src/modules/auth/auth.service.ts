import { AppError } from "../../common/errors/app-error.js";
import type { AuthRepository, AuthResult, AuthUser, PublicUser } from "./auth.types.js";
import type { LoginInput, RefreshTokenInput, RegisterInput } from "./auth.schemas.js";
import { PasswordService } from "./password.service.js";
import { TokenService } from "./token.service.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService = new PasswordService(),
    private readonly tokenService = new TokenService()
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await this.authRepository.findUserByPhone(input.phone);

    if (existingUser) {
      throw new AppError(409, "AUTH_PHONE_ALREADY_REGISTERED", "Phone number is already registered.");
    }

    if (input.email) {
      const existingEmailUser = await this.authRepository.findUserByEmail(input.email);

      if (existingEmailUser) {
        throw new AppError(409, "AUTH_EMAIL_ALREADY_REGISTERED", "Email is already registered.");
      }
    }

    const passwordHash = await this.passwordService.hashPassword(input.password);
    const user = await this.authRepository.createUser({
      fullName: input.full_name,
      email: input.email ?? null,
      phone: input.phone,
      passwordHash,
      role: "customer"
    });

    return this.createAuthResult(user);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.authRepository.findUserByPhone(input.phone);

    if (!user || !user.isActive) {
      throw new AppError(401, "AUTH_INVALID_CREDENTIALS", "Invalid phone or password.");
    }

    const passwordMatches = await this.passwordService.verifyPassword(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError(401, "AUTH_INVALID_CREDENTIALS", "Invalid phone or password.");
    }

    return this.createAuthResult(user);
  }

  async refresh(input: RefreshTokenInput): Promise<AuthResult> {
    const tokenHash = this.tokenService.hashRefreshToken(input.refresh_token);
    const refreshToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (!refreshToken) {
      throw new AppError(401, "AUTH_INVALID_REFRESH_TOKEN", "Refresh token is invalid.");
    }

    if (refreshToken.revokedAt) {
      await this.authRepository.revokeRefreshTokenFamily(refreshToken.tokenFamilyId);
      throw new AppError(401, "AUTH_INVALID_REFRESH_TOKEN", "Refresh token is invalid.");
    }

    if (refreshToken.expiresAt <= new Date()) {
      await this.authRepository.revokeRefreshToken(refreshToken.id);
      throw new AppError(401, "AUTH_INVALID_REFRESH_TOKEN", "Refresh token is invalid.");
    }

    if (!refreshToken.user.isActive) {
      throw new AppError(401, "AUTH_INVALID_REFRESH_TOKEN", "Refresh token is invalid.");
    }

    return this.createAuthResult(refreshToken.user, refreshToken.tokenFamilyId, refreshToken.id);
  }

  async logout(input: RefreshTokenInput) {
    const tokenHash = this.tokenService.hashRefreshToken(input.refresh_token);
    const refreshToken = await this.authRepository.findRefreshTokenByHash(tokenHash);

    if (refreshToken && !refreshToken.revokedAt) {
      await this.authRepository.revokeRefreshToken(refreshToken.id);
    }

    return { revoked: true };
  }

  toPublicUser(user: AuthUser): PublicUser {
    return {
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_active: user.isActive
    };
  }

  private async createAuthResult(user: AuthUser, tokenFamilyId?: string, rotateRefreshTokenId?: string): Promise<AuthResult> {
    const accessToken = await this.tokenService.createAccessToken({
      userId: user.id,
      role: user.role
    });
    const refreshToken = this.tokenService.createRefreshToken(tokenFamilyId);
    const refreshTokenInput = {
      userId: user.id,
      tokenHash: refreshToken.tokenHash,
      tokenFamilyId: refreshToken.tokenFamilyId,
      expiresAt: refreshToken.expiresAt
    };

    if (rotateRefreshTokenId) {
      await this.authRepository.rotateRefreshToken(rotateRefreshTokenId, refreshTokenInput);
    } else {
      await this.authRepository.createRefreshToken(refreshTokenInput);
    }

    return {
      user: this.toPublicUser(user),
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken.token,
        expires_in: this.tokenService.accessTokenExpiresInSeconds
      }
    };
  }
}
