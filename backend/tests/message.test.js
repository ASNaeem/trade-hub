const { app, startServer, stopServer } = require("../server");
const mongoose = require("mongoose");
const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const request = require("supertest");

describe("Message API Tests", () => {
  let server;
  let senderToken;
  let receiverToken;
  let senderId;
  let receiverId;
  let messageId;

  const testSender = {
    name: "Test Sender",
    email: "sender@test.com",
    password: "password123",
    phone: "+1234567890",
  };

  const testReceiver = {
    name: "Test Receiver",
    email: "receiver@test.com",
    password: "password123",
    phone: "+0987654321",
  };

  beforeAll(async () => {
    server = await startServer();

    // Create test users
    const senderRes = await request(app)
      .post("/api/users/register")
      .send(testSender);
    senderToken = senderRes.body.token;
    senderId = senderRes.body.user.id;

    const receiverRes = await request(app)
      .post("/api/users/register")
      .send(testReceiver);
    receiverToken = receiverRes.body.token;
    receiverId = receiverRes.body.user.id;
  });

  afterAll(async () => {
    await Message.deleteMany({});
    await User.deleteMany({});
    await stopServer();
  });

  test("Send a message", async () => {
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${senderToken}`)
      .send({
        receiverId: receiverId,
        content: "Hello, this is a test message",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.content).toBe("Hello, this is a test message");
    messageId = res.body._id;
  });

  test("Get user messages", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${receiverToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Mark message as read", async () => {
    const res = await request(app)
      .put(`/api/messages/${messageId}/read`)
      .set("Authorization", `Bearer ${receiverToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.isRead).toBeTruthy();
  });
});
