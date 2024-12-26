const request = require("supertest");
const { app } = require("../server");
const mongoose = require("mongoose");
const MessageModel = require("../models/messageSchema");
const UserModel = require("../models/userSchema");
const GlobalPolicySettingModel = require("../models/globalPolicySettingSchema");
const jwt = require("jsonwebtoken");
const { startTestServer, stopTestServer } = require("./testHelper");
const AdminModel = require("../models/adminSchema");
const bcrypt = require("bcryptjs");
const DisputeModel = require("../models/disputeSchema");

jest.setTimeout(90000); // Set global timeout to 90 seconds

describe("Message API Tests", () => {
  let user1Token;
  let user2Token;
  let user1Id;
  let user2Id;
  let messageId;
  let server;
  let adminId;
  let adminToken;

  beforeAll(async () => {
    server = await startTestServer();

    // Create test users
    const user1Res = await request(app).post("/api/users/register").send({
      name: "Test User 1",
      email: "testuser1@test.com",
      phone: "+1234567890",
      password: "password123",
    });

    const user2Res = await request(app).post("/api/users/register").send({
      name: "Test User 2",
      email: "testuser2@test.com",
      phone: "+1234567891",
      password: "password123",
    });

    // Get OTP and verify users
    const user1 = await UserModel.findOne({ email: "testuser1@test.com" });
    const user2 = await UserModel.findOne({ email: "testuser2@test.com" });

    // Set OTP for users
    await UserModel.findByIdAndUpdate(user1._id, {
      otp: "123456",
      isVerified: false,
    });
    await UserModel.findByIdAndUpdate(user2._id, {
      otp: "123456",
      isVerified: false,
    });

    await request(app).post("/api/auth/verify-otp").send({
      email: "testuser1@test.com",
      otp: "123456",
    });

    await request(app).post("/api/auth/verify-otp").send({
      email: "testuser2@test.com",
      otp: "123456",
    });

    // Login users
    const loginRes1 = await request(app).post("/api/users/login").send({
      email: "testuser1@test.com",
      password: "password123",
    });

    const loginRes2 = await request(app).post("/api/users/login").send({
      email: "testuser2@test.com",
      password: "password123",
    });

    user1Token = loginRes1.body.token;
    user2Token = loginRes2.body.token;
    user1Id = user1._id;
    user2Id = user2._id;

    // Create admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    const adminData = {
      name: "Admin User",
      email: "admin@tradehub.com",
      password: hashedPassword,
      role: "admin",
    };
    const admin = await AdminModel.create(adminData);
    adminId = admin._id;

    // Login admin to get token
    const adminLoginRes = await request(app).post("/api/admin/login").send({
      email: adminData.email,
      password: "admin123",
    });
    adminToken = adminLoginRes.body.token;

    // Create policies
    await GlobalPolicySettingModel.create({
      name: "maxReportsBeforeReview",
      value: 3,
      description: "Maximum number of reports before user review",
      createdBy: adminId,
    });

    await GlobalPolicySettingModel.create({
      name: "maxDisputesBeforeBan",
      value: 5,
      description: "Maximum number of disputes before user ban",
      createdBy: adminId,
    });
  }, 90000);

  beforeEach(async () => {
    await MessageModel.deleteMany({});
    await GlobalPolicySettingModel.deleteMany({});
    await DisputeModel.deleteMany({});

    // Reset user's banned status
    await UserModel.findByIdAndUpdate(user1Id, {
      isBanned: false,
      banReason: null,
      isUnderReview: false,
    });

    // Recreate policies before each test
    await GlobalPolicySettingModel.create({
      name: "maxReportsBeforeReview",
      value: 3,
      description: "Maximum number of reports before user review",
      createdBy: adminId,
    });

    await GlobalPolicySettingModel.create({
      name: "maxDisputesBeforeBan",
      value: 5,
      description: "Maximum number of disputes before user ban",
      createdBy: adminId,
    });

    // Create a test message for message retrieval tests
    const messageData = {
      senderId: user1Id,
      receiverId: user2Id,
      content: "Test message for retrieval",
    };
    const message = await MessageModel.create(messageData);
    messageId = message._id;
  });

  afterEach(async () => {
    await MessageModel.deleteMany({});
    await GlobalPolicySettingModel.deleteMany({});
  });

  afterAll(async () => {
    await MessageModel.deleteMany({});
    await UserModel.deleteMany({});
    await AdminModel.deleteMany({});
    await GlobalPolicySettingModel.deleteMany({});
    await stopTestServer(server);
  }, 90000);

  describe("Message Operations", () => {
    test("Send message between users", async () => {
      const messageData = {
        receiverId: user2Id,
        content: "Hello, Test User 2!",
      };

      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${user1Token}`)
        .send(messageData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.content).toBe(messageData.content);
      messageId = res.body._id;

      // Wait a bit to ensure message is saved
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }, 30000);

    test("Get user's messages", async () => {
      // Create a test message first
      const messageData = {
        receiverId: user2Id,
        content: "Test message for retrieval",
      };

      const createRes = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${user1Token}`)
        .send(messageData);

      expect(createRes.statusCode).toBe(201);

      // Wait for message to be saved
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now try to get the messages
      const res = await request(app)
        .get("/api/messages")
        .set("Authorization", `Bearer ${user2Token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].content).toBe(messageData.content);
    }, 30000);

    test("Report and resolve a message", async () => {
      // Create a message to report
      const messageRes = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          receiverId: user2Id,
          content: "Message to report",
        });

      expect(messageRes.statusCode).toBe(201);
      const messageId = messageRes.body._id;

      // Wait for message to be saved
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Report the message
      const reportRes = await request(app)
        .post(`/api/disputes/report`)
        .set("Authorization", `Bearer ${user2Token}`)
        .send({
          reportType: "message",
          contentId: messageId,
          reason: "inappropriate",
          description: "Test report",
        });

      expect(reportRes.statusCode).toBe(201);
      expect(reportRes.body).toHaveProperty("_id");

      // Wait for report to be processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Resolve the dispute
      const resolveRes = await request(app)
        .put(`/api/disputes/${reportRes.body._id}/resolve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          resolution: "warning",
          notes: "Test resolution",
        });

      expect(resolveRes.statusCode).toBe(200);
      expect(resolveRes.body.status).toBe("resolved");
    }, 30000);

    test("Enforce max reports before review", async () => {
      // Create multiple reports to trigger review
      for (let i = 0; i < 3; i++) {
        const messageRes = await request(app)
          .post("/api/messages")
          .set("Authorization", `Bearer ${user1Token}`)
          .send({
            receiverId: user2Id,
            content: `Test message ${i}`,
          });

        const reportRes = await request(app)
          .post(`/api/disputes/report`)
          .set("Authorization", `Bearer ${user2Token}`)
          .send({
            reportType: "message",
            contentId: messageRes.body._id,
            reason: "inappropriate",
            description: "Test report",
          });

        if (i < 2) {
          expect(reportRes.statusCode).toBe(201);
        } else {
          expect(reportRes.statusCode).toBe(400);
          expect(reportRes.body.message).toContain("under review");
        }

        // Wait a bit between reports
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }, 30000);

    test("Enforce max disputes before ban", async () => {
      // Create and resolve multiple disputes to trigger ban
      for (let i = 0; i < 5; i++) {
        // Create a message to report
        const messageRes = await request(app)
          .post("/api/messages")
          .set("Authorization", `Bearer ${user1Token}`)
          .send({
            receiverId: user2Id,
            content: `Test message ${i}`,
          });

        expect(messageRes.statusCode).toBe(201);

        // Wait for message to be saved
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Report the message
        const reportRes = await request(app)
          .post(`/api/disputes/report`)
          .set("Authorization", `Bearer ${user2Token}`)
          .send({
            reportType: "message",
            contentId: messageRes.body._id,
            reason: "inappropriate",
            description: "Test report",
          });

        expect(reportRes.statusCode).toBe(201);

        // Resolve each dispute with a warning
        const resolveRes = await request(app)
          .put(`/api/disputes/${reportRes.body._id}/resolve`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            resolution: "warning",
            notes: "Test resolution",
          });

        expect(resolveRes.statusCode).toBe(200);
        expect(resolveRes.body.status).toBe("resolved");

        // Wait for resolution to be processed
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Try to send one more message after being banned
      const finalMessageRes = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${user1Token}`)
        .send({
          receiverId: user2Id,
          content: "This should fail",
        });

      expect(finalMessageRes.statusCode).toBe(403);
      expect(finalMessageRes.body.message).toBe("Account has been banned");

      // Verify that the user is banned
      const user = await UserModel.findById(user1Id);
      expect(user.isBanned).toBe(true);
    }, 30000);
  });
});
