const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");
const UserModel = require("../models/userSchema");
const TokenModel = require("../models/tokenSchema");
const jwt = require("jsonwebtoken");
const { startTestServer, stopTestServer } = require("./testHelper");

jest.setTimeout(90000); // Set global timeout to 90 seconds

describe("Token API Tests", () => {
  let userId;
  let userToken;
  let verificationToken;
  let server;

  beforeAll(async () => {
    server = await startTestServer();

    // Create test user
    const userRes = await request(app).post("/api/users/register").send({
      name: "Test User",
      email: "testuser@test.com",
      phone: "+1234567890",
      password: "password123",
    });

    // Get OTP and verify user
    const user = await UserModel.findOne({ email: "testuser@test.com" });
    userId = user._id;

    await request(app).post("/api/auth/verify-otp").send({
      email: "testuser@test.com",
      otp: user.otp,
    });

    // Login user
    const loginRes = await request(app).post("/api/users/login").send({
      email: "testuser@test.com",
      password: "password123",
    });

    userToken = loginRes.body.token;

    // Create verification token
    const tokenRes = await request(app)
      .post("/api/tokens/verification")
      .set("Authorization", `Bearer ${userToken}`)
      .send();

    expect(tokenRes.statusCode).toBe(201);
    expect(tokenRes.body).toHaveProperty("token");
    verificationToken = tokenRes.body;
  }, 90000);

  beforeEach(async () => {
    await TokenModel.deleteMany({});

    // Create verification token
    const tokenRes = await request(app)
      .post("/api/tokens/verification")
      .set("Authorization", `Bearer ${userToken}`)
      .send();

    expect(tokenRes.statusCode).toBe(201);
    expect(tokenRes.body).toHaveProperty("token");
    verificationToken = tokenRes.body;
  });

  afterEach(async () => {
    await TokenModel.deleteMany({});
  });

  afterAll(async () => {
    await TokenModel.deleteMany({});
    await UserModel.deleteMany({});
    await stopTestServer(server);
  }, 90000);

  describe("Token Operations", () => {
    test("Verify valid token", async () => {
      const res = await request(app).post("/api/tokens/verify").send({
        token: verificationToken.token,
        type: "verification",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("verified");
    }, 30000);

    test("Delete token", async () => {
      const res = await request(app)
        .delete(`/api/tokens/${verificationToken.token}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send();

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("deleted");
    }, 30000);
  });
});
