// __tests__/auth.test.js
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server"); // assuming server.js exports the Express app
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "patient",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should not register a user with an existing email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      role: "patient",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Jane Dup",
      email: "jane@example.com",
      password: "newpass",
      role: "doctor",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should login a registered user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Sam Login",
      email: "sam@example.com",
      password: "password123",
      role: "doctor",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "sam@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("sam@example.com");
  });
});
