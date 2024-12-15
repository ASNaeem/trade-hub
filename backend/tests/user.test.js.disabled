const { app, server } = require("../server");
const mongoose = require("mongoose");
const User = require("../models/userSchema");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const testUser = {
  name: "John Doe",
  email: "johndoe@example.com",
  password: "password123",
  phone: "+1234567890",
};

let token;

describe("User API Tests", () => {
  beforeAll(async () => {
    const dbUri =
      process.env.TEST_DB_URI || "mongodb://localhost:27017/tradehub_test";
    await mongoose.connect(dbUri);
    console.log("Test MongoDB Connected...");
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
    if (server) server.close(); // Safely close server if it exists
  });
    test("Fail to register a user with missing fields", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: "test@example.com", password: "password123" }); // Missing `name` and `phone`

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Validation failed");
  });
    
  test("Register a new user", async () => {
    const res = await request(app).post("/api/users/register").send(testUser);

    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.name).toBe(testUser.name);
  });

  test("Login a user", async () => {
    await request(app).post("/api/users/register").send(testUser);
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: testUser.email, password: testUser.password });
    console.log("Login Response:", res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Fail to update profile without token", async () => {
    const res = await request(app).put("/api/users/profile").send({
      name: "Updated Name",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("Fail to get user profile without token", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  test("Fail to get user profile with invalid token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid token");
  });

  test("Update only name field in profile", async () => {
    await request(app).post("/api/users/register").send(testUser);

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: testUser.email, password: testUser.password });
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${loginRes.body.token}`)
      .send({ name: "Updated Name" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe("Updated Name");
    expect(res.body.user.phone).toBe(testUser.phone); // Ensure phone remains unchanged
  });

  test("Get user profile", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);
    console.log("Profile Response:", res.body); // Debugging
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(testUser.email);
  });

  test("Update user profile with invalid phone", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "invalid_phone" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid phone number format");
  });

  test("Delete user account", async () => {
    await request(app).post("/api/users/register").send(testUser);
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: testUser.email, password: testUser.password });
    const res = await request(app)
      .delete("/api/users/profile") // Assuming DELETE /api/users/profile endpoint
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });
});
