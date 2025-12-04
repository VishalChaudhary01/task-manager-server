import { prisma } from "@/config/prisma";
import { StatusCode } from "@/config/status-code.config";
import { AppError } from "@/middlewares/error-handler";
import {
  createTaskSchema,
  updateTaskSchema,
} from "@/validators/task.validator";
import { RequestHandler } from "express";

export const getTasks: RequestHandler = async (req, res) => {
  const tasks = await prisma.task.findMany();

  res
    .status(StatusCode.OK)
    .json({ message: "All tasks fetched successfully", tasks });
};

export const createTask: RequestHandler = async (req, res) => {
  const data = createTaskSchema.parse(req.body);

  const existingTask = await prisma.task.findUnique({
    where: { title: data.title },
  });
  if (existingTask) {
    throw new AppError(
      "Task with given title is already present",
      StatusCode.CONFLICT
    );
  }

  const task = await prisma.task.create({
    data: { ...data },
  });

  res
    .status(StatusCode.CREATED)
    .json({ message: "Task created successfully", task: task });
};

export const updateTask: RequestHandler = async (req, res) => {
  const data = updateTaskSchema.parse(req.body);
  const id = req.params.id;

  const task = await prisma.task.findUnique({
    where: { id },
  });
  if (!task) {
    throw new AppError("Task not found", StatusCode.NOT_FOUND);
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { ...data },
  });

  res
    .status(StatusCode.OK)
    .json({ message: "Task updated successfully", task: updatedTask });
};

export const deleteTask: RequestHandler = async (req, res) => {
  const id = req.params.id;

  const task = await prisma.task.findUnique({
    where: { id },
  });
  if (!task) {
    throw new AppError("Task not found", StatusCode.NOT_FOUND);
  }

  await prisma.task.delete({
    where: { id },
  });

  res.status(StatusCode.OK).json({ message: "Task deleted successfully" });
};
