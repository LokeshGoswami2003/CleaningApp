import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";
import { InMemoryAuthRepository } from "./in-memory-auth.repository.js";

function createTestApp() {
  const authRepository = new InMemoryAuthRepository();
  const app = createApp({ authRepository, usersRepository: authRepository });

  return { app, authRepository };
}

const validRegisterPayload = {
  full_name: "Vaishali Sharma",
  email: "vaishali@example.com",
  phone: "9876543210",
  password: "StrongPass123"
};

describe("auth routes", () => {
  it("registers a customer and returns auth tokens", async () => {
    const { app, authRepository } = createTestApp();

    const response = await request(app).post("/api/v1/auth/register").send(validRegisterPayload);

    expect(response.status).toBe(201);
    expect(response.body.data.user).toMatchObject({
      full_name: "Vaishali Sharma",
      email: "vaishali@example.com",
      phone: "9876543210",
      role: "customer"
    });
    expect(response.body.data.tokens.access_token).toEqual(expect.any(String));
    expect(response.body.data.tokens.refresh_token).toEqual(expect.any(String));
    expect(response.body.data.tokens.expires_in).toBe(900);
    expect(response.body.data.user.passwordHash).toBeUndefined();
    expect(authRepository.getRefreshTokenCount()).toBe(1);
  });

  it("rejects duplicate phone registration", async () => {
    const { app } = createTestApp();

    await request(app).post("/api/v1/auth/register").send(validRegisterPayload);
    const response = await request(app).post("/api/v1/auth/register").send(validRegisterPayload);

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("AUTH_PHONE_ALREADY_REGISTERED");
  });

  it("logs in an existing customer", async () => {
    const { app } = createTestApp();

    await request(app).post("/api/v1/auth/register").send(validRegisterPayload);
    const response = await request(app).post("/api/v1/auth/login").send({
      phone: validRegisterPayload.phone,
      password: validRegisterPayload.password
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.phone).toBe(validRegisterPayload.phone);
    expect(response.body.data.tokens.access_token).toEqual(expect.any(String));
  });

  it("returns the current user from an access token", async () => {
    const { app } = createTestApp();

    const registerResponse = await request(app).post("/api/v1/auth/register").send(validRegisterPayload);
    const accessToken = registerResponse.body.data.tokens.access_token as string;

    const response = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.user).toMatchObject({
      phone: validRegisterPayload.phone,
      role: "customer",
      is_active: true
    });
  });

  it("rotates refresh tokens", async () => {
    const { app, authRepository } = createTestApp();

    const registerResponse = await request(app).post("/api/v1/auth/register").send(validRegisterPayload);
    const refreshToken = registerResponse.body.data.tokens.refresh_token as string;

    const response = await request(app).post("/api/v1/auth/refresh").send({
      refresh_token: refreshToken
    });

    expect(response.status).toBe(200);
    expect(response.body.data.tokens.refresh_token).toEqual(expect.any(String));
    expect(response.body.data.tokens.refresh_token).not.toBe(refreshToken);
    expect(authRepository.getRefreshTokenCount()).toBe(2);
  });

  it("rejects reused refresh tokens after rotation", async () => {
    const { app } = createTestApp();

    const registerResponse = await request(app).post("/api/v1/auth/register").send(validRegisterPayload);
    const refreshToken = registerResponse.body.data.tokens.refresh_token as string;

    await request(app).post("/api/v1/auth/refresh").send({
      refresh_token: refreshToken
    });
    const response = await request(app).post("/api/v1/auth/refresh").send({
      refresh_token: refreshToken
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTH_INVALID_REFRESH_TOKEN");
  });

  it("logs out by revoking a refresh token", async () => {
    const { app } = createTestApp();

    const registerResponse = await request(app).post("/api/v1/auth/register").send(validRegisterPayload);
    const refreshToken = registerResponse.body.data.tokens.refresh_token as string;

    const logoutResponse = await request(app).post("/api/v1/auth/logout").send({
      refresh_token: refreshToken
    });
    const refreshResponse = await request(app).post("/api/v1/auth/refresh").send({
      refresh_token: refreshToken
    });

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.data.revoked).toBe(true);
    expect(refreshResponse.status).toBe(401);
  });

  it("rejects invalid login credentials", async () => {
    const { app } = createTestApp();

    await request(app).post("/api/v1/auth/register").send(validRegisterPayload);
    const response = await request(app).post("/api/v1/auth/login").send({
      phone: validRegisterPayload.phone,
      password: "WrongPass123"
    });

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTH_INVALID_CREDENTIALS");
  });

  it("validates register payloads", async () => {
    const { app } = createTestApp();

    const response = await request(app).post("/api/v1/auth/register").send({
      full_name: "V",
      phone: "123",
      password: "short"
    });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
