import { Request, Response, NextFunction } from "express";
import { MongoError } from "mongodb";
import logger from "../../config/logger.config.js";

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error:", err);

  // Handle MongoDB duplicate key error
  if (err instanceof MongoError && err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate value error",
      error: {
        code: "DUPLICATE_VALUE",
        details: err.message,
      },
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.code,
      },
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: {
        code: "INVALID_TOKEN",
      },
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: {
        code: "VALIDATION_ERROR",
        details: err.message,
      },
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
}; 