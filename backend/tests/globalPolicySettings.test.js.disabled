const { startTestServer, stopTestServer } = require("./testHelper");
const { app } = require("../server");
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Item = require("../models/itemSchema");
const GlobalPolicySetting = require("../models/globalPolicySettingSchema");

describe("Global Policy Settings Tests", () => {
  let server;
  let adminToken;
  let userToken;
  let adminId;
  let userId;

  const testAdmin = {
    name: "Test Admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  };

  const testUser = {
    name: "Test User",
    email: "user@test.com",
    password: "password123",
    phone: "+1234567890",
  };

  const testItem = {
    title: "Test Item",
    description: "Test Description",
    price: 100,
    category: "Electronics",
    condition: "New",
    location: "Test Location",
    images: [
      {
        type: "url",
        url: "http://example.com/image.jpg",
      },
    ],
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
  }, 30000);

  beforeEach(async () => {
    await GlobalPolicySetting.deleteMany({});
  });

  afterAll(async () => {
    await GlobalPolicySetting.deleteMany({});
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Item.deleteMany({});
    await stopTestServer(server);
  });

  describe("Policy Management", () => {
    test("Create new policy", async () => {
      const res = await request(app)
        .post("/api/policies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "maxItemsPerUser",
          value: 5,
          description: "Maximum number of items a user can have listed",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("name", "maxItemsPerUser");
      expect(res.body).toHaveProperty("value", 5);
    }, 30000);

    test("Get all policies", async () => {
      // Create a test policy first
      await request(app)
        .post("/api/policies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "maxItemsPerUser",
          value: 5,
          description: "Maximum number of items a user can have listed",
        });

      const res = await request(app)
        .get("/api/policies")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    }, 30000);

    test("Update policy", async () => {
      // Create a test policy first
      const createRes = await request(app)
        .post("/api/policies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "maxItemsPerUser",
          value: 5,
          description: "Maximum number of items a user can have listed",
        });

      const res = await request(app)
        .put(`/api/policies/${createRes.body._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          value: 10,
          description: "Updated maximum number of items",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("value", 10);
    }, 30000);
  });

  describe("Policy Enforcement", () => {
    test("Enforce max items per user", async () => {
      // Create max items policy
      await request(app)
        .post("/api/policies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "maxItemsPerUser",
          value: 1,
          description: "Maximum number of items a user can have listed",
        });

      // Create first item (should succeed)
      const firstItemRes = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send(testItem);

      expect(firstItemRes.statusCode).toBe(201);

      // Try to create second item (should fail)
      const secondItemRes = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${userToken}`)
        .send(testItem);

      expect(secondItemRes.statusCode).toBe(400);
      expect(secondItemRes.body.message).toContain("Policy violation");
    }, 30000);

    test("Enforce max price for unverified users", async () => {
      // Create max price policy for unverified users
      await request(app)
        .post("/api/policies")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "maxPriceUnverified",
          value: 50,
          description: "Maximum price for unverified users",
        });

      // Create unverified user
      const unverifiedUser = {
        name: "Unverified User",
        email: "unverified@test.com",
        password: "password123",
        phone: "+0987654321",
      };

      await request(app).post("/api/users/register").send(unverifiedUser);

      const unverifiedLoginRes = await request(app)
        .post("/api/users/login")
        .send({
          email: unverifiedUser.email,
          password: unverifiedUser.password,
        });

      // Try to create item with price above limit
      const itemRes = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${unverifiedLoginRes.body.token}`)
        .send({
          ...testItem,
          price: 100,
        });

      expect(itemRes.statusCode).toBe(400);
      expect(itemRes.body.message).toContain("Policy violation");
    }, 30000);
  });
});
