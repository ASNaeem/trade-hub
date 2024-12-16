const request = require("supertest");
const { app, server } = require("../server");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const Item = require("../models/itemSchema");
const jwt =  require("jsonwebtoken");
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
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  location: "Rajshahi", // Assuming you use divisions as locations
  visibilityStatus: "visible", // Explicitly adding visibility status here
  sellerId:"",
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

    // Decode the token and extract the sellerId (this should be ObjectId from the User model)
    const decodedToken = jwt.decode(token);
    testItem.sellerId = decodedToken.id;  // sellerId is now correctly set as ObjectId
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

    console.log(res.body);  // Log the response body to ensure correct item creation
    expect(res.statusCode).toBe(201);
    expect(res.body.item).toHaveProperty("id");
    expect(res.body.item.title).toBe(testItem.title);
    itemId = res.body.item.id; // Save the item ID for later tests
    console.log("item id: ", itemId);
  });

  test("Get all items (public) without visibility filter", async () => {
    const res = await request(app).get("/api/items");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    // Ensure that visibilityStatus is included but no filtering is done
    res.body.forEach(item => {
      expect(item).toHaveProperty('visibilityStatus');
    });
  });

  test("Get item by ID (public)", async () => {
    expect(itemId).toBeDefined();
    const res = await request(app).get(`/api/items/${itemId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe(testItem.title);
    expect(res.body.visibilityStatus).toBe(testItem.visibilityStatus); // Ensure visibility status is returned
  });

  test("Update an item (private, requires authorization)", async () => {
    const updatedData = { title: "Updated Item Title", price: 150, visibilityStatus: "hidden" };
    const res = await request(app)
      .put(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.item.title).toBe(updatedData.title);
    expect(res.body.item.price).toBe(updatedData.price);
    expect(res.body.item.visibilityStatus).toBe(updatedData.visibilityStatus); // Ensure visibility status is updated
  });

  test("Fail to update an item without authorization (private)", async () => {
    const updatedData = { title: "Updated Item Title", price: 150 };
    const res = await request(app)
      .put(`/api/items/${itemId}`)
      .send(updatedData); // No token here

    expect(res.statusCode).toBe(401); // Unauthorized
    expect(res.body.message).toBe("No token provided");
  });

  test("Filter items by category (public)", async () => {
    const res = await request(app).get("/api/items?category=Electronics");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((item) => {
      expect(item.category).toBe("Electronics");
    });
  });

  test("Filter items by location (public)", async () => {
    const res = await request(app).get("/api/items?location=Rajshahi");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((item) => {
      expect(item.location).toBe("Rajshahi");
    });
  });

  test("Delete an item (private, requires authorization)", async () => {
    const res = await request(app)
      .delete(`/api/items/${itemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item deleted successfully");
  });

  test("Fail to delete an item without authorization (private)", async () => {
    const res = await request(app).delete(`/api/items/${itemId}`);

    expect(res.statusCode).toBe(401); // Unauthorized
    expect(res.body.message).toBe("No token provided");
  });

  test("Fail to get a deleted item", async () => {
    const res = await request(app).get(`/api/items/${itemId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Item not found");
  });
});
