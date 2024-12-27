const { startTestServer, stopTestServer } = require("./testHelper");
const { app } = require("../server");
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const Item = require("../models/itemSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const Dispute = require("../models/disputeSchema");

describe("Dispute API Tests", () => {
  let server;
  let userToken;
  let adminToken;
  let userId;
  let adminId;
  let itemId;

  const testUser = {
    name: "Test User",
    email: "user@test.com",
    password: "password123",
    phone: "+1234567890",
  };

  const testAdmin = {
    name: "Test Admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  };

  const testItem = {
    title: "Test Item",
    description: "Test Description",
    price: 99.99,
    category: "Electronics",
    condition: "New",
    location: "Test Location",
  };

  beforeAll(async () => {
    server = await startTestServer();

    // Create and verify admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testAdmin.password, salt);
    const admin = new Admin({
      name: testAdmin.name,
      email: testAdmin.email,
      password: hashedPassword,
      role: testAdmin.role,
      isVerified: true,
    });
    const savedAdmin = await admin.save();
    adminId = savedAdmin._id;

    // Login admin
    const adminLoginRes = await request(app).post("/api/admin/login").send({
      email: testAdmin.email,
      password: testAdmin.password,
    });
    adminToken = adminLoginRes.body.token;

    // Create and verify user
    const userRes = await request(app)
      .post("/api/users/register")
      .send(testUser);
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isVerified: true }
    );

    // Login user
    const userLoginRes = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    userToken = userLoginRes.body.token;
    userId = userLoginRes.body.user.id;

    // Create test item
    const itemRes = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${userToken}`)
      .send(testItem);
    itemId = itemRes.body._id;
  });

  beforeEach(async () => {
    await Dispute.deleteMany({});
  });

  afterAll(async () => {
    await Dispute.deleteMany({});
    await Item.deleteMany({});
    await User.deleteMany({});
    await Admin.deleteMany({});
    await stopTestServer(server);
  });

  describe("Dispute Creation", () => {
    test("Create new dispute", async () => {
      const res = await request(app)
        .post("/api/disputes/report")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          reportType: "item",
          contentId: itemId,
          reason: "inappropriate",
          description: "This item violates community guidelines",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.reason).toBe("inappropriate");
    });

    test("Fail to create dispute with invalid reason", async () => {
      const res = await request(app)
        .post("/api/disputes/report")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          reportType: "item",
          contentId: itemId,
          reason: "invalid_reason",
          description: "This should fail",
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("Dispute Retrieval", () => {
    test("Get user disputes", async () => {
      // Create a test dispute first
      const disputeRes = await request(app)
        .post("/api/disputes/report")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          reportType: "item",
          contentId: itemId,
          reason: "inappropriate",
          description: "Test dispute",
        });

      const res = await request(app)
        .get("/api/disputes")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("Get empty disputes list for new user", async () => {
      const res = await request(app)
        .get("/api/disputes")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(0);
    });
  });

  describe("Dispute Resolution", () => {
    test("Admin can resolve a dispute", async () => {
      // Create a test dispute first
      const disputeRes = await request(app)
        .post("/api/disputes/report")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          reportType: "item",
          contentId: itemId,
          reason: "inappropriate",
          description: "Test dispute",
        });

      const res = await request(app)
        .put(`/api/disputes/${disputeRes.body._id}/resolve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          resolution: "warning",
          notes: "First warning issued",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("resolved");
      expect(res.body.resolution).toBe("warning");
      expect(res.body.adminNote).toBe("First warning issued");
    });

    test("Non-admin cannot resolve dispute", async () => {
      // Create a test dispute first
      const disputeRes = await request(app)
        .post("/api/disputes/report")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          reportType: "item",
          contentId: itemId,
          reason: "inappropriate",
          description: "Test dispute",
        });

      const res = await request(app)
        .put(`/api/disputes/${disputeRes.body._id}/resolve`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          resolution: "warning",
          notes: "This should fail",
        });

      expect(res.statusCode).toBe(403);
    });

    test("Cannot resolve non-existent dispute", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/disputes/${nonExistentId}/resolve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          resolution: "warning",
          notes: "This should fail",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toContain("Dispute not found");
    });
  });
});
