import { prisma } from "@/config/prisma";
import {
  describe,
  expect,
  it,
  afterEach,
  beforeEach,
  afterAll,
} from "@jest/globals";
import request from "supertest";
import { app } from "..";

const TASK_URL = "/api/v1/tasks";

beforeEach(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /api/v1/tasks", () => {
  const validInputData = {
    title: "First task for testing",
    description: "This is used for testing",
  };

  it("should create new task", async () => {
    const response = await request(app)
      .post(TASK_URL)
      .send(validInputData)
      .expect(201);

    const task = await prisma.task.findUnique({
      where: { title: validInputData.title },
    });

    expect(task).toBeDefined();
    expect(task?.title).toBe(validInputData.title);

    expect(response.body.message).toContain("Task created successfully");
    expect(response.body.task.title).toBe(validInputData.title);
  });

  it("should throw conflict error if duplicate title given", async () => {
    await prisma.task.create({
      data: validInputData,
    });

    const response = await request(app)
      .post(TASK_URL)
      .send(validInputData)
      .expect(409);

    expect(response.body.message).toContain(
      "Task with given title is already present"
    );
  });

  it("should throw error if title is empty", async () => {
    const response = await request(app).post(TASK_URL).send({}).expect(400);

    expect(response.body.message).toBeDefined();
  });
});

describe("PUT /api/v1/tasks/:id", () => {
  const createTaskInput = {
    title: "First task for testing",
    description: "This is used for testing",
  };
  const updateTaskInput = {
    status: "COMPLETED",
  };

  it("should update task if valid input and id provided", async () => {
    const newTask = await prisma.task.create({
      data: createTaskInput,
    });
    const taskId = newTask?.id;

    const response = await request(app)
      .put(`${TASK_URL}/${taskId}`)
      .send(updateTaskInput)
      .expect(200);

    expect(response.body.message).toContain("Task updated successfully");
    expect(response.body.task.status).toContain("COMPLETED");
  });

  it("should throw error if task not found", async () => {
    const taskId = "123456";
    const response = await request(app)
      .put(`${TASK_URL}/${taskId}`)
      .send(updateTaskInput)
      .expect(404);

    expect(response.body.message).toContain("Task not found");
  });

  it("should throw error if invalid status provided", async () => {
    const newTask = await prisma.task.create({
      data: createTaskInput,
    });
    const taskId = newTask?.id;

    const response = await request(app)
      .put(`${TASK_URL}/${taskId}`)
      .send({ status: "WRONG_STATUS" })
      .expect(400);

    expect(response.body.message).toBeDefined();
  });
});

describe("DELETE /api/v1/tasks/:id", () => {
  const createTaskInput = {
    title: "First task for testing",
    description: "This is used for testing",
  };

  it("should delete task of given id", async () => {
    const newTask = await prisma.task.create({
      data: createTaskInput,
    });

    const taskId = newTask?.id;

    const response = await request(app)
      .delete(`${TASK_URL}/${taskId}`)
      .expect(200);

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    expect(response.body.message).toContain("Task deleted successfully");
    expect(task).toBe(null);
  });

  it("should throw error if task not found for given id", async () => {
    const taskId = "123456";
    const response = await request(app)
      .delete(`${TASK_URL}/${taskId}`)
      .expect(404);

    expect(response.body.message).toContain("Task not found");
  });
});

describe("GET /api/v1/tasks", () => {
  const createTaskInput = {
    title: "First task for testing",
    description: "This is used for testing",
  };

  it("should return array of all tasks", async () => {
    await prisma.task.create({
      data: createTaskInput,
    });

    const response = await request(app).get(TASK_URL).expect(200);
    const task = await prisma.task.findUnique({
      where: { title: createTaskInput.title },
    });

    expect(response.body.message).toContain("All tasks fetched successfully");
    expect(Array.isArray(response.body.tasks)).toBe(true);
    expect(response.body.tasks.length).toBe(1);
  });
  it("should return empty array if not tasks present", async () => {
    const response = await request(app).get(TASK_URL).expect(200);

    expect(response.body.message).toContain("All tasks fetched successfully");
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });
});
