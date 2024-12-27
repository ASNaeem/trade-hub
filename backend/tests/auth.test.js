const request = require("supertest");
const {
  setupTestDB,
  teardownTestDB,
  clearDatabase,
  app,
} = require("./testHelper");
const User = require("../models/userSchema");

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

beforeEach(async () => {
  await clearDatabase();
});

describe("Authentication Tests", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    phone: "+1234567890",
    password: "testpassword123",
  };

  describe("Registration", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/users/register").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("email", testUser.email);
    });

    it("should not register a user with existing email", async () => {
      // First registration
      await request(app).post("/api/users/register").send(testUser);

      // Second registration with same email
      const res = await request(app).post("/api/users/register").send(testUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Email already registered");
    });

    it("should not register a user with invalid password", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({
          ...testUser,
          password: "123", // Too short
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        "Password must be at least 8 characters"
      );
    });
  });

  describe("Login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/users/register").send(testUser);
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should not login with non-existent email", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("Email Verification", () => {
    let verificationToken;
    let userEmail;

    beforeEach(async () => {
      const res = await request(app).post("/api/users/register").send(testUser);

      verificationToken = res.body.token;
      userEmail = res.body.email;
    });

    it("should verify email with correct token", async () => {
      const res = await request(app).post("/api/users/verify-email").send({
        tokenValue: verificationToken,
        email: userEmail,
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain("verified successfully");
    });

    it("should not verify with incorrect token", async () => {
      const res = await request(app).post("/api/users/verify-email").send({
        tokenValue: "wrongtoken",
        email: userEmail,
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain(
        "Invalid or expired verification code"
      );
    });
  });
});
