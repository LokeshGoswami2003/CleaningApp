import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./common/errors/error-handler.js";
import { notFoundHandler } from "./common/middleware/not-found.js";
import { requestId } from "./common/middleware/request-id.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { PrismaAuthRepository } from "./modules/auth/auth.repository.js";
import type { AuthRepository } from "./modules/auth/auth.types.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { createAdminUsersRouter, createUsersRouter } from "./modules/users/users.routes.js";
import type { UsersRepository } from "./modules/users/users.types.js";

type AppDependencies = {
  authRepository?: AuthRepository;
  usersRepository?: UsersRepository;
};

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const authRepository = dependencies.authRepository ?? new PrismaAuthRepository();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(requestId);

  app.use("/api/v1/auth", createAuthRouter({ authRepository }));
  app.use("/api/v1/users", createUsersRouter({ authRepository, usersRepository: dependencies.usersRepository }));
  app.use("/api/v1/admin/users", createAdminUsersRouter({ authRepository, usersRepository: dependencies.usersRepository }));
  app.use("/api/v1/health", healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
