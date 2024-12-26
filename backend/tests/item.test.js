const { startTestServer, stopTestServer } = require("./testHelper");
const { app } = require("../server");
const mongoose = require("mongoose");
const request = require("supertest");
const Item = require("../models/itemSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const GlobalPolicySetting = require("../models/globalPolicySettingSchema");
const bcrypt = require("bcryptjs");

describe("Item API Tests", () => {
  let server;
  let authToken;
  let userId;
  let adminId;

  const testAdmin = {
    name: "Test Admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  };

  const testUser = {
    name: "Test Seller",
    email: "seller@test.com",
    password: "password123",
    phone: "+1234567890",
  };

  const testItem = {
    title: "Test Item",
    description: "Test Description",
    price: 99.99,
    brand: "Test Brand",
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

    // Create user
    const userRes = await request(app)
      .post("/api/users/register")
      .send(testUser);

    // Verify user
    await User.findOneAndUpdate(
      { email: testUser.email },
      { isVerified: true }
    );

    // Login to get valid token
    const loginRes = await request(app).post("/api/users/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    authToken = loginRes.body.token;
    userId = loginRes.body.user.id;

    // Create necessary policies
    await GlobalPolicySetting.create({
      name: "maxItemsPerUser",
      value: 10,
      description: "Maximum number of items a user can have listed",
      createdBy: adminId,
    });

    await GlobalPolicySetting.create({
      name: "maxPriceUnverified",
      value: 1000,
      description: "Maximum price for unverified users",
      createdBy: adminId,
    });

    await GlobalPolicySetting.create({
      name: "minItemPrice",
      value: 1,
      description: "Minimum item price",
      createdBy: adminId,
    });

    await GlobalPolicySetting.create({
      name: "maxItemPrice",
      value: 10000,
      description: "Maximum item price",
      createdBy: adminId,
    });
  });

  beforeEach(async () => {
    await Item.deleteMany({});
  });

  afterAll(async () => {
    await Item.deleteMany({});
    await User.deleteMany({});
    await Admin.deleteMany({});
    await GlobalPolicySetting.deleteMany({});
    await stopTestServer(server);
  });

  describe("Item Operations", () => {
    test("Create new item", async () => {
      const res = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testItem);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe(testItem.title);
      expect(res.body.sellerId).toBe(userId);
    });

    test("Get all items", async () => {
      // Create a test item first
      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testItem);

      const res = await request(app).get("/api/items");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("Get item by ID", async () => {
      // Create a test item first
      const itemRes = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testItem);

      const res = await request(app).get(`/api/items/${itemRes.body._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(itemRes.body._id);
      expect(res.body.title).toBe(testItem.title);
    });

    test("Get items by category", async () => {
      // Create multiple test items with different categories
      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testItem, category: "Electronics" });

      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testItem, category: "Furniture" });

      const res = await request(app).get("/api/items?category=Electronics");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(
        res.body.every((item) => item.category === "Electronics")
      ).toBeTruthy();
    });

    test("Get items by brand", async () => {
      // Create multiple test items with different brands
      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testItem, brand: "Samsung" });

      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testItem, brand: "Apple" });

      const res = await request(app).get("/api/items?brand=Samsung");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body.every((item) => item.brand === "Samsung")).toBeTruthy();
    });

    test("Get items by price range", async () => {
      // Create multiple test items with different prices
      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testItem, price: 50 });

      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testItem, price: 150 });

      await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...testItem, price: 250 });

      const res = await request(app).get(
        "/api/items?minPrice=100&maxPrice=200"
      );

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(
        res.body.every((item) => item.price >= 100 && item.price <= 200)
      ).toBeTruthy();
    });

    test("Update item", async () => {
      // Create a test item first
      const itemRes = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testItem);

      const updates = {
        title: "Updated Title",
        price: 149.99,
      };

      const res = await request(app)
        .put(`/api/items/${itemRes.body._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(updates.title);
      expect(res.body.price).toBe(updates.price);
    });

    test("Delete item", async () => {
      // Create a test item first
      const itemRes = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testItem);

      const res = await request(app)
        .delete(`/api/items/${itemRes.body._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Item deleted successfully");

      // Verify item is deleted
      const checkRes = await request(app).get(`/api/items/${itemRes.body._id}`);
      expect(checkRes.statusCode).toBe(404);
    });

    test("Cannot update other user's item", async () => {
      // Create another user
      const otherUser = {
        name: "Other User",
        email: "other@test.com",
        password: "password123",
        phone: "+0987654321",
      };

      await request(app).post("/api/users/register").send(otherUser);

      await User.findOneAndUpdate(
        { email: otherUser.email },
        { isVerified: true }
      );

      const otherLoginRes = await request(app).post("/api/users/login").send({
        email: otherUser.email,
        password: otherUser.password,
      });

      // Create item with first user
      const itemRes = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testItem);

      // Try to update with other user
      const res = await request(app)
        .put(`/api/items/${itemRes.body._id}`)
        .set("Authorization", `Bearer ${otherLoginRes.body.token}`)
        .send({ title: "Unauthorized Update" });

      expect(res.statusCode).toBe(403);
    });
  });
});
