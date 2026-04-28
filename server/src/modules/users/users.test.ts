import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";
import { PasswordService } from "../auth/password.service.js";
import { InMemoryAuthRepository } from "../auth/in-memory-auth.repository.js";

function createTestApp() {
  const authRepository = new InMemoryAuthRepository();
  const app = createApp({ authRepository, usersRepository: authRepository });

  return { app, authRepository };
}

async function registerCustomer(app: ReturnType<typeof createApp>) {
  const response = await request(app).post("/api/v1/auth/register").send({
    full_name: "Customer User",
    email: "customer@example.com",
    phone: "9000000001",
    password: "StrongPass123"
  });

  return {
    accessToken: response.body.data.tokens.access_token as string,
    userId: response.body.data.user.id as string
  };
}

async function createAdminLogin(app: ReturnType<typeof createApp>, authRepository: InMemoryAuthRepository) {
  const passwordService = new PasswordService();
  await authRepository.createUser({
    fullName: "Admin User",
    email: "admin@example.com",
    phone: "9000000002",
    passwordHash: await passwordService.hashPassword("AdminPass123"),
    role: "admin"
  });

  const response = await request(app).post("/api/v1/auth/login").send({
    phone: "9000000002",
    password: "AdminPass123"
  });

  return response.body.data.tokens.access_token as string;
}

describe("users routes", () => {
  it("returns and updates the current user profile", async () => {
    const { app } = createTestApp();
    const { accessToken } = await registerCustomer(app);

    const getResponse = await request(app).get("/api/v1/users/me").set("Authorization", `Bearer ${accessToken}`);
    const patchResponse = await request(app).patch("/api/v1/users/me").set("Authorization", `Bearer ${accessToken}`).send({
      full_name: "Updated Customer",
      email: "updated-customer@example.com"
    });

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.user.full_name).toBe("Customer User");
    expect(patchResponse.status).toBe(200);
    expect(patchResponse.body.data.user).toMatchObject({
      full_name: "Updated Customer",
      email: "updated-customer@example.com"
    });
  });

  it("rejects anonymous profile requests", async () => {
    const { app } = createTestApp();

    const response = await request(app).get("/api/v1/users/me");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("AUTH_REQUIRED");
  });

  it("allows admins to list users", async () => {
    const { app, authRepository } = createTestApp();
    await registerCustomer(app);
    const adminAccessToken = await createAdminLogin(app, authRepository);

    const response = await request(app).get("/api/v1/admin/users").set("Authorization", `Bearer ${adminAccessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.users).toHaveLength(2);
  });

  it("rejects customer access to admin user routes", async () => {
    const { app } = createTestApp();
    const { accessToken } = await registerCustomer(app);

    const response = await request(app).get("/api/v1/admin/users").set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("AUTH_FORBIDDEN");
  });

  it("allows admins to deactivate a user", async () => {
    const { app, authRepository } = createTestApp();
    const { userId } = await registerCustomer(app);
    const adminAccessToken = await createAdminLogin(app, authRepository);

    const response = await request(app)
      .patch(`/api/v1/admin/users/${userId}/status`)
      .set("Authorization", `Bearer ${adminAccessToken}`)
      .send({ is_active: false });

    expect(response.status).toBe(200);
    expect(response.body.data.user).toMatchObject({
      id: userId,
      is_active: false
    });
  });
});
