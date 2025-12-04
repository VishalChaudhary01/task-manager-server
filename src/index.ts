import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { Env } from "./config/Env.config";
import { AppError, errorHandler } from "./middlewares/error-handler";
import { StatusCode } from "./config/status-code.config";
import taskRoutes from "./routes/task.route";
import { prisma } from "./config/prisma";

export const app = express();
const PORT = Env.PORT;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy server!" });
});

app.use("/api/v1/tasks", taskRoutes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`API route ${req.path} not found`, StatusCode.NOT_FOUND));
});

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
