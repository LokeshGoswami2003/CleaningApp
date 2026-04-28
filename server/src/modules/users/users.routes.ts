import { Router } from "express";
import { authenticate, requireRoles } from "../../common/middleware/authenticate.js";
import { validateRequest } from "../../common/validation/validate-request.js";
import type { AuthRepository } from "../auth/auth.types.js";
import { PrismaUsersRepository } from "./users.repository.js";
import { updateMyProfileSchema, updateUserStatusSchema, userIdParamsSchema } from "./users.schemas.js";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import type { UsersRepository } from "./users.types.js";

type UsersRouterDependencies = {
  authRepository: AuthRepository;
  usersRepository?: UsersRepository;
};

export function createUsersRouter(dependencies: UsersRouterDependencies) {
  const router = Router();
  const usersRepository = dependencies.usersRepository ?? new PrismaUsersRepository();
  const usersService = new UsersService(usersRepository);
  const usersController = new UsersController(usersService);

  router.use(authenticate(dependencies.authRepository));
  router.get("/me", usersController.getMe);
  router.patch("/me", validateRequest({ body: updateMyProfileSchema }), usersController.updateMe);

  return router;
}

export function createAdminUsersRouter(dependencies: UsersRouterDependencies) {
  const router = Router();
  const usersRepository = dependencies.usersRepository ?? new PrismaUsersRepository();
  const usersService = new UsersService(usersRepository);
  const usersController = new UsersController(usersService);

  router.use(authenticate(dependencies.authRepository), requireRoles("admin"));
  router.get("/", usersController.listUsers);
  router.patch(
    "/:id/status",
    validateRequest({ params: userIdParamsSchema, body: updateUserStatusSchema }),
    usersController.updateUserStatus
  );

  return router;
}

