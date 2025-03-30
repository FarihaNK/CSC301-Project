const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server"); // ensure server.js exports `app`
const sequelize = require("../config/test-db");
const Task = require("../models/ToDoList");

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

describe("To-Do List API", () => {
  let token;
  beforeEach(() => {
    token = generateToken();
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ task: "Test Task" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.task).toBe("Test Task");
  });

  it("should fetch user’s tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a task", async () => {
    const create = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ task: "To Complete" });

    const update = await request(app)
      .put(`/api/tasks/${create.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ completed: true });

    expect(update.statusCode).toBe(200);
    expect(update.body.completed).toBe(true);
  });

  it("should delete a task", async () => {
    const create = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ task: "To Delete" });

    const del = await request(app)
      .delete(`/api/tasks/${create.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(del.statusCode).toBe(200);
    expect(del.body.message).toBe("Task deleted successfully");
  });
});
