import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { AppError } from "./error.middleware.js";

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      throw new AppError("Validation failed", 400, "VALIDATION_ERROR");
    }

    next();
  };
}; 