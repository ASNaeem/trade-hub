const request = require("supertest");
const { app, server } = require("../server");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Item = require("../models/itemSchema");

let token; // To store the user token
let itemId; // To store the created item ID

// Sample test data
const testUser = {
  name: "Seller",
  email: "seller@example.com",
  password: "password123",
  phone: "+1234567890",
};

const testItem = {
  title: "Test Item",
  description: "This is a test item",
  price: 100,
  brand: "Test Brand",
  category: "Electronics",
  condition: "New",
  images: ["image1.jpg", "image2.jpg"],
  location: "Rajshahi", // Assuming you use divisions as locations
};

describe("Item API Tests", () => {
  beforeAll(async () => {
    const dbUri = process.env.TEST_DB_URI || "mongodb://localhost:27017/tradehub_test";
    await mongoose.connect(dbUri);
    console.log("Test MongoDB Connected...");

    // Register and login test user to get a token
    await request(app).post("/api/users/register").send(testUser);
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: testUser.email, password: testUser.password });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Item.deleteMany({});
    await mongoose.connection.close();
    if (server) server.close();
  });

  test("Create a new item", async () => {
    const res = await request(app)
      .post("/api/items")
      .set("Authorization", `Bearer ${token}`)
      .send(testItem);

    console.log(res.body); // Debugging response
    expect(res.statusCode).toBe(201);
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item.title).toBe(testItem.title);
    itemId = res.body.item.id; // Save the item ID for later tests
  });

  test("Get all items", async () => {
    const res = await request(app).get("/api/items");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Get item by ID", async () => {
    const res = await request(app).get(`/api/items/${itemId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(testItem.title);
  });

  test("Update an item", async () => {
    const updatedData = { title: "Updated Item Title", price: 150 };
    const res = await request(app)
      .put(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.item.title).toBe(updatedData.title);
    expect(res.body.item.price).toBe(updatedData.price);
  });

  test("Filter items by category", async () => {
    const res = await request(app).get("/api/items?category=Electronics");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((item) => {
      expect(item.category).toBe("Electronics");
    });
  });

  test("Filter items by location", async () => {
    const res = await request(app).get("/api/items?location=Rajshahi");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((item) => {
      expect(item.location).toBe("Rajshahi");
    });
  });

  test("Delete an item", async () => {
    const res = await request(app)
      .delete(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item deleted successfully");
  });

  test("Fail to get a deleted item", async () => {
    const res = await request(app).get(`/api/items/${itemId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Item not found");
  });
});
