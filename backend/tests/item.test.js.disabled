const mongoose = require("mongoose");
const supertest = require("supertest");
const { app } = require("../server");
const Item = require("../models/itemSchema");
const User = require("../models/userSchema");
const { setupTestDB, teardownTestDB } = require("./testHelper");

const api = supertest(app);

describe("Item API", () => {
  let testUser;

  beforeAll(async () => {
    await setupTestDB();

    // Create a test user
    testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      phone: "+1234567890",
      password: "password123",
      city: "Test City",
      isDocumentVerified: true,
    });
  });

  beforeEach(async () => {
    await Item.deleteMany({});

    // Create test items
    const testItems = [
      {
        title: "Vintage Leather Jacket",
        description: "Classic leather jacket",
        price: 129.99,
        brand: "Levi's",
        category: "Clothing",
        condition: "New",
        location: "New York",
        sellerId: testUser._id,
        images: [{ type: "url", url: "http://example.com/image1.jpg" }],
      },
      {
        title: "Gaming Console",
        description: "Latest gaming console",
        price: 399.99,
        brand: "Sony",
        category: "Electronics",
        condition: "Used",
        location: "Los Angeles",
        sellerId: testUser._id,
        images: [{ type: "url", url: "http://example.com/image2.jpg" }],
      },
      {
        title: "Generic Smartphone",
        description: "Smartphone",
        price: 299.99,
        brand: null, // Testing "Other" brand
        category: "Electronics",
        condition: "Refurbished",
        location: "Chicago",
        sellerId: testUser._id,
        images: [{ type: "url", url: "http://example.com/image3.jpg" }],
      },
    ];

    await Item.insertMany(testItems);
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  describe("GET /api/items", () => {
    test("returns all items when no filters are applied", async () => {
      const response = await api.get("/api/items");
      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(3);
    });

    test("filters by brand correctly", async () => {
      const response = await api
        .get("/api/items")
        .query({ brands: ["Levi's"] });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].brand).toBe("Levi's");
    });

    test('filters by "Other" brand correctly', async () => {
      const response = await api.get("/api/items").query({ brands: ["Other"] });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].brand).toBeNull();
    });

    test("filters by location correctly", async () => {
      const response = await api
        .get("/api/items")
        .query({ locations: ["New York"] });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].location).toBe("New York");
    });

    test("filters by condition correctly", async () => {
      const response = await api
        .get("/api/items")
        .query({ conditions: ["Used"] });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].condition).toBe("Used");
    });

    test("filters by price range correctly", async () => {
      const response = await api
        .get("/api/items")
        .query({ minPrice: 300, maxPrice: 500 });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].price).toBe(399.99);
    });

    test("combines multiple filters correctly", async () => {
      const response = await api.get("/api/items").query({
        conditions: ["Used"],
        locations: ["Los Angeles"],
        minPrice: 300,
        maxPrice: 500,
      });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].condition).toBe("Used");
      expect(response.body.items[0].location).toBe("Los Angeles");
      expect(response.body.items[0].price).toBe(399.99);
    });

    test("returns empty array when no items match filters", async () => {
      const response = await api.get("/api/items").query({
        conditions: ["New"],
        locations: ["Los Angeles"], // This combination doesn't exist
      });

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(0);
    });
  });
});
