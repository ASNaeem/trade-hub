const { startTestServer, stopTestServer } = require("./testHelper");
const { app } = require("../server");
const mongoose = require("mongoose");
const Admin = require("../models/adminSchema");
const request = require("supertest");
const bcrypt = require("bcryptjs");

// Increase timeout for all tests in this file
jest.setTimeout(30000);

describe("Admin API Tests", () => {
  let server;
  let superAdminToken;
  let adminToken;

  const testSuperAdmin = {
    name: "Super Admin",
    email: "admin@tradehub.com",
    password: "Admin@123",
    role: "superadmin",
  };

  beforeAll(async () => {
    server = await startTestServer();

    // Clean up any existing data
    await Admin.deleteMany({});
    console.log("Cleaned up existing admin data");

    // Create a super admin with known credentials
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testSuperAdmin.password, salt);
    const superAdmin = new Admin({
      name: testSuperAdmin.name,
      email: testSuperAdmin.email.toLowerCase(),
      password: hashedPassword,
      role: testSuperAdmin.role,
    });
    await superAdmin.save();
    console.log("Created test super admin:", superAdmin.email);
  });

  afterAll(async () => {
    await Admin.deleteMany({});
    await stopTestServer(server);
  });

  describe("Admin Authentication", () => {
    test("Should list all admins in database", async () => {
      const admins = await Admin.find({}, "-password");
      console.log("Current admins in database:", admins);
    });

    test("Should verify password hash", async () => {
      const admin = await Admin.findOne({
        email: testSuperAdmin.email.toLowerCase(),
      });
      console.log("Found admin:", admin ? admin.email : "not found");

      if (admin) {
        const isMatch = await bcrypt.compare(
          testSuperAdmin.password,
          admin.password
        );
        console.log("Password match result:", isMatch);
        expect(isMatch).toBe(true);
      } else {
        fail("Admin not found in database");
      }
    });

    test("Admin login with correct credentials", async () => {
      console.log("Attempting login with:", {
        email: testSuperAdmin.email,
        password: testSuperAdmin.password,
      });

      const res = await request(app).post("/api/admin/login").send({
        email: testSuperAdmin.email,
        password: testSuperAdmin.password,
      });

      console.log("Login response:", {
        status: res.status,
        body: res.body,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.role).toBe("superadmin");
    });

    test("Admin login with wrong password", async () => {
      const res = await request(app).post("/api/admin/login").send({
        email: testSuperAdmin.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });

    test("Admin login with non-existent email", async () => {
      const res = await request(app).post("/api/admin/login").send({
        email: "nonexistent@tradehub.com",
        password: testSuperAdmin.password,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });

    test("Admin login with missing credentials", async () => {
      const res = await request(app).post("/api/admin/login").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email and password are required");
    });
  });

  describe("Admin Profile", () => {
    beforeEach(async () => {
      // Login and get token
      const loginRes = await request(app).post("/api/admin/login").send({
        email: testSuperAdmin.email,
        password: testSuperAdmin.password,
      });
      superAdminToken = loginRes.body.token;
    });

    test("Get admin profile with valid token", async () => {
      const res = await request(app)
        .get("/api/admin/profile")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(testSuperAdmin.email.toLowerCase());
      expect(res.body.role).toBe("superadmin");
    });
  });
});
