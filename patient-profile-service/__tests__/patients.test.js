const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const app = require("../server");
const Patient = require("../models/Patient");
const User = require("../models/User");

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create a fake user manually in the DB
  const user = new User({
    name: "Test User",
    email: "test@example.com",
    password: "hashed", // Assume password is already hashed or not required for this test
    role: "patient"
  });

  const savedUser = await user.save();
  userId = savedUser._id;

  // Generate token manually
  token = jwt.sign({ id: userId, role: "patient" }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Patient API", () => {
  it("should create a new patient", async () => {
    const res = await request(app)
      .post("/api/patients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "John Doe",
        phoneNumber: "1234567890",
        dob: "2000-01-01",
        healthCardNumber: "HC123456",
        address: "123 Test Street",
        isDependant: true
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.patient.fullName).toBe("John Doe");
  });

  it("should fetch all patients for a user", async () => {
    const res = await request(app)
      .get("/api/patients")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
