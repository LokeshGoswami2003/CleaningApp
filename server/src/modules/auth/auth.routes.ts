import { Router } from "express";
import { authenticate } from "../../common/middleware/authenticate.js";
import { validateRequest } from "../../common/validation/validate-request.js";
import { AuthController } from "./auth.controller.js";
import { PrismaAuthRepository } from "./auth.repository.js";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.schemas.js";
import { AuthService } from "./auth.service.js";
import type { AuthRepository } from "./auth.types.js";

type AuthRouterDependencies = {
  authRepository?: AuthRepository;
};

export function createAuthRouter(dependencies: AuthRouterDependencies = {}) {
  const router = Router();
  const authRepository = dependencies.authRepository ?? new PrismaAuthRepository();
  const authService = new AuthService(authRepository);
  const authController = new AuthController(authService);

  router.post("/register", validateRequest({ body: registerSchema }), authController.register);
  router.post("/login", validateRequest({ body: loginSchema }), authController.login);
  router.post("/refresh", validateRequest({ body: refreshTokenSchema }), authController.refresh);
  router.post("/logout", validateRequest({ body: refreshTokenSchema }), authController.logout);
  router.get("/me", authenticate(authRepository), authController.me);

  return router;
}
