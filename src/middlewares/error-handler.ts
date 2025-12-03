import { Env } from "@/config/Env.config";
import { HTTPStatusCode, StatusCode } from "@/config/status-code.config";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  public statusCode: HTTPStatusCode;

  constructor(
    message: string,
    statusCode: HTTPStatusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = async (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(`Error occure at path: ${req.path}`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => `${issue.message}`).join(", ");
    return res.status(StatusCode.BAD_REQUEST).json({ message });
  }

  return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    message:
      Env.NODE_ENV === "development"
        ? error.message ??
          "We are sorry for the inconvenience. Something went wrong on the server. Please try again later."
        : "Unexpected error occure",
  });
};
