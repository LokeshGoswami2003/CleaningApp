import type { RequestHandler } from "express";
import type { UserRole } from "../constants/roles.js";
import { AppError } from "../errors/app-error.js";
import { TokenService } from "../../modules/auth/token.service.js";
import type { AuthRepository } from "../../modules/auth/auth.types.js";

export function authenticate(authRepository: AuthRepository, tokenService = new TokenService()): RequestHandler {
  return async (request, _response, next) => {
    try {
      const authorization = request.header("authorization");

      if (!authorization?.startsWith("Bearer ")) {
        throw new AppError(401, "AUTH_REQUIRED", "Authentication is required.");
      }

      const token = authorization.slice("Bearer ".length);
      const payload = await tokenService.verifyAccessToken(token);
      const user = await authRepository.findUserById(payload.userId);

      if (!user || !user.isActive) {
        throw new AppError(401, "AUTH_REQUIRED", "Authentication is required.");
      }

      request.auth = { user };
      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }

      next(new AppError(401, "AUTH_INVALID_TOKEN", "Access token is invalid or expired."));
    }
  };
}

export function requireRoles(...roles: UserRole[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth) {
      next(new AppError(401, "AUTH_REQUIRED", "Authentication is required."));
      return;
    }

    if (!roles.includes(request.auth.user.role)) {
      next(new AppError(403, "AUTH_FORBIDDEN", "You do not have permission to access this resource."));
      return;
    }

    next();
  };
}
