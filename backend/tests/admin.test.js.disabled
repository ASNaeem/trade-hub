const { startTestServer, stopTestServer } = require("./testHelper");
const { app } = require("../server");
const mongoose = require("mongoose");
const Admin = require("../models/adminSchema");
const request = require("supertest");
const bcrypt = require("bcryptjs");

describe("Admin API Tests", () => {
  let server;
  let superAdminToken;
  let adminToken;

  const testSuperAdmin = {
    name: "Super Admin",
    email: "superadmin@test.com",
    password: "password123",
    role: "superadmin",
  };

  const testAdmin = {
    name: "Regular Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  };

  beforeAll(async () => {
    server = await startTestServer();

    // Create a super admin first
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testSuperAdmin.password, salt);
    const superAdmin = new Admin({
      name: testSuperAdmin.name,
      email: testSuperAdmin.email,
      password: hashedPassword,
      role: testSuperAdmin.role,
      isVerified: true,
    });
    await superAdmin.save();

    // Login as super admin
    const loginRes = await request(app).post("/api/admin/login").send({
      email: testSuperAdmin.email,
      password: testSuperAdmin.password,
    });
    superAdminToken = loginRes.body.token;

    // Create regular admin
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash(
      testAdmin.password,
      adminSalt
    );
    const admin = new Admin({
      name: testAdmin.name,
      email: testAdmin.email,
      password: adminHashedPassword,
      role: testAdmin.role,
      isVerified: true,
    });
    await admin.save();

    // Login as regular admin
    const adminLoginRes = await request(app).post("/api/admin/login").send({
      email: testAdmin.email,
      password: testAdmin.password,
    });
    adminToken = adminLoginRes.body.token;
  });

  beforeEach(async () => {
    // Clean up any test data if needed
  });

  afterAll(async () => {
    await Admin.deleteMany({});
    await stopTestServer(server);
  });

  describe("Admin Authentication", () => {
    test("Admin login successful", async () => {
      const res = await request(app).post("/api/admin/login").send({
        email: testAdmin.email,
        password: testAdmin.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.role).toBe("admin");
    });

    test("Admin login with invalid credentials", async () => {
      const res = await request(app).post("/api/admin/login").send({
        email: testAdmin.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Admin Profile Management", () => {
    test("Get admin profile", async () => {
      const res = await request(app)
        .get("/api/admin/profile")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(testAdmin.email);
      expect(res.body.role).toBe("admin");
    });

    test("Update admin profile", async () => {
      const res = await request(app)
        .put("/api/admin/profile")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Admin Name",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.admin.name).toBe("Updated Admin Name");
    });

    test("Fail to access profile without token", async () => {
      const res = await request(app).get("/api/admin/profile");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Admin Authorization", () => {
    test("Regular admin cannot access superadmin routes", async () => {
      const res = await request(app)
        .post("/api/admin/register")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "New Admin",
          email: "newadmin@test.com",
          password: "password123",
          role: "admin",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe(
        "Forbidden - Requires superadmin privileges"
      );
    });

    test("Superadmin can create new admin", async () => {
      const res = await request(app)
        .post("/api/admin/register")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "New Admin",
          email: "newadmin@test.com",
          password: "password123",
          role: "admin",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.role).toBe("admin");
      expect(res.body.name).toBe("New Admin");
      expect(res.body.email).toBe("newadmin@test.com");
    });
  });
});
