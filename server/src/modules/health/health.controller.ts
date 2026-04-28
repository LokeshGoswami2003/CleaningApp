import type { RequestHandler } from "express";
import { sendSuccess } from "../../common/http/response.js";

export const getHealth: RequestHandler = (_request, response) => {
  sendSuccess(response, {
    status: "ok",
    service: "cleaning-app-api"
  });
};

