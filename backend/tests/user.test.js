const { startTestServer, stopTestServer } = require("./testHelper");
const { app } = require("../server");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const request = require("supertest");

// Mock email service
jest.mock("../services/emailService", () => ({
  sendOTP: jest.fn().mockResolvedValue(true),
  verifyOTP: jest.fn().mockResolvedValue(true),
}));

describe("User API Tests", () => {
  let server;
  let userToken;
  let userId;

  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    phone: "+1234567890",
  };

  beforeAll(async () => {
    server = await startTestServer();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await stopTestServer(server);
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  test("Register new user", async () => {
    const res = await request(app).post("/api/users/register").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("email");
    expect(res.body.email).toBe(testUser.email);
  });

  test("Login user", async () => {
    // First register a user
    await request(app).post("/api/users/register").send(testUser);

    // First verify the user since we mocked the email verification
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isVerified: true }
    );

    const res = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    userToken = res.body.token;
  });

  test("Get user profile", async () => {
    // First register and login
    await request(app).post("/api/users/register").send(testUser);
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isVerified: true }
    );
    const loginRes = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    userToken = loginRes.body.token;

    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(testUser.name);
    expect(res.body.email).toBe(testUser.email);
  });

  test("Update user profile", async () => {
    // First register and login
    await request(app).post("/api/users/register").send(testUser);
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isVerified: true }
    );
    const loginRes = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    userToken = loginRes.body.token;

    const updates = {
      name: "Updated Name",
      phone: "+9876543210",
    };

    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .send(updates);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updates.name);
    expect(res.body.phone).toBe(updates.phone);
  });

  test("Fail to register user with short password", async () => {
    const invalidUser = {
      ...testUser,
      password: "short", // Less than 8 characters
    };

    const res = await request(app)
      .post("/api/users/register")
      .send(invalidUser);

    expect(res.statusCode).toBe(400);
  });

  test("Successfully delete user profile", async () => {
    // First register and login
    await request(app).post("/api/users/register").send(testUser);
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isVerified: true }
    );
    const loginRes = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    userToken = loginRes.body.token;

    const res = await request(app)
      .delete("/api/users/profile")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);

    // Verify user can't login after deletion
    const secondLoginRes = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(secondLoginRes.statusCode).toBe(401);
  });

  test("Update user profile picture", async () => {
    // First register and login
    await request(app).post("/api/users/register").send(testUser);
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isVerified: true }
    );
    const loginRes = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    userToken = loginRes.body.token;

    const updates = {
      profilePicture: {
        data: Buffer.from("fake-profile-picture").toString("base64"),
        contentType: "image/jpeg",
      },
    };

    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${userToken}`)
      .send(updates);

    expect(res.statusCode).toBe(200);
    expect(res.body.profilePicture).toBeTruthy();
  });

  // Keep other existing tests...
});
