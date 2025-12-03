import { Status } from "@/@generated/prisma/enums";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(155, "Title is too long"),
  description: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum([Status.PENDING, Status.COMPLETED]).optional(),
});
