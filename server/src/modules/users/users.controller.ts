import type { Request, RequestHandler } from "express";
import { AppError } from "../../common/errors/app-error.js";
import { sendSuccess } from "../../common/http/response.js";
import type { UpdateMyProfileInput, UpdateUserStatusInput, UserIdParams } from "./users.schemas.js";
import type { UsersService } from "./users.service.js";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  getMe: RequestHandler = (request, response, next) => {
    try {
      const user = getAuthenticatedUser(request);
      sendSuccess(response, {
        user: this.usersService.getMe(user)
      });
    } catch (error) {
      next(error);
    }
  };

  updateMe: RequestHandler = async (request, response, next) => {
    try {
      const user = getAuthenticatedUser(request);
      const updatedUser = await this.usersService.updateMe(user, request.body as UpdateMyProfileInput);
      sendSuccess(response, {
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  };

  listUsers: RequestHandler = async (_request, response, next) => {
    try {
      const users = await this.usersService.listUsers();
      sendSuccess(response, {
        users
      });
    } catch (error) {
      next(error);
    }
  };

  updateUserStatus: RequestHandler = async (request, response, next) => {
    try {
      const params = request.params as UserIdParams;
      const body = request.body as UpdateUserStatusInput;
      const user = await this.usersService.setUserStatus(params.id, body.is_active);

      sendSuccess(response, {
        user
      });
    } catch (error) {
      next(error);
    }
  };
}

function getAuthenticatedUser(request: Request) {
  if (!request.auth) {
    throw new AppError(401, "AUTH_REQUIRED", "Authentication is required.");
  }

  return request.auth.user;
}
