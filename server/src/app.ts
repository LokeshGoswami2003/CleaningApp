import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "./common/errors/error-handler.js";
import { notFoundHandler } from "./common/middleware/not-found.js";
import { requestId } from "./common/middleware/request-id.js";
import { healthRouter } from "./modules/health/health.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(requestId);

  app.use("/api/v1/health", healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

