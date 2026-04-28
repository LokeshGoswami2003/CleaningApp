import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";

describe("health route", () => {
  it("returns the API health status", async () => {
    const app = createApp();

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        status: "ok",
        service: "cleaning-app-api"
      },
      meta: {}
    });
  });
});

