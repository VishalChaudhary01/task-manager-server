import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "@/controller/task.controller";
import { Router } from "express";

const taskRoutes = Router();

taskRoutes.get("/", getTasks);
taskRoutes.post("/", createTask);
taskRoutes.put("/:id", updateTask);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;
