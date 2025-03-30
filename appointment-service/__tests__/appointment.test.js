const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");
const sequelize = require("../config/test-db");
const Appointment = require("../models/Appointment");

// Fake token generator
const generateToken = (userId = "user123") =>
  jwt.sign({ id: userId, role: "patient" }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Appointment API", () => {
  let token;
  beforeEach(() => {
    token = generateToken(); // fresh token for each test
  });

  it("should create an appointment", async () => {
    const res = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Appointment",
        description: "Test Desc",
        date: "2025-04-01",
        appointmentTime: "14:00:00",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Appointment");
  });

  it("should fetch user’s appointments", async () => {
    const res = await request(app)
      .get("/api/appointments")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update an appointment", async () => {
    const create = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "To Update",
        description: "",
        date: "2025-04-01",
        appointmentTime: "12:00:00",
      });

    const id = create.body.id;

    const update = await request(app)
      .put(`/api/appointments/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        description: "Updated",
        date: "2025-04-02",
        appointmentTime: "15:00:00",
      });

    expect(update.statusCode).toBe(200);
    expect(update.body.title).toBe("Updated Title");
  });

  it("should delete an appointment", async () => {
    const create = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "To Delete",
        description: "",
        date: "2025-04-01",
        appointmentTime: "10:00:00",
      });

    const id = create.body.id;

    const del = await request(app)
      .delete(`/api/appointments/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(del.statusCode).toBe(200);
    expect(del.body.message).toBe("appointment deleted successfully");
  });
});
