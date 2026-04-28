import type { RequestHandler } from "express";
import { AppError } from "../../common/errors/app-error.js";
import { sendSuccess } from "../../common/http/response.js";
import type { AuthService } from "./auth.service.js";
import type { LoginInput, RefreshTokenInput, RegisterInput } from "./auth.schemas.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.register(request.body as RegisterInput);
      response.status(201);
      sendSuccess(response, result);
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.login(request.body as LoginInput);
      sendSuccess(response, result);
    } catch (error) {
      next(error);
    }
  };

  refresh: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.refresh(request.body as RefreshTokenInput);
      sendSuccess(response, result);
    } catch (error) {
      next(error);
    }
  };

  logout: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.logout(request.body as RefreshTokenInput);
      sendSuccess(response, result);
    } catch (error) {
      next(error);
    }
  };

  me: RequestHandler = (request, response, next) => {
    try {
      if (!request.auth) {
        throw new AppError(401, "AUTH_REQUIRED", "Authentication is required.");
      }

      sendSuccess(response, {
        user: this.authService.toPublicUser(request.auth.user)
      });
    } catch (error) {
      next(error);
    }
  };
}
