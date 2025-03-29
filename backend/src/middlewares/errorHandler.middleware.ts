import { Request, Response, NextFunction } from 'express';
import { NODE_ENV } from '../constants/env.js';
import AppError from '../interfaces/AppError.js';
import { INTERNAL_SERVER_ERROR } from '../constants/http.js';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong';
  let errorCode = undefined;
  let stack = undefined;
  
  // If it's our custom error, use its values
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.code;
  } else if (err.name === 'ValidationError') {
    // Handle validation errors from Mongoose
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    // Handle invalid ObjectId errors
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    // Handle JWT expiration
    statusCode = 401;
    message = 'Token expired';
  }

  // Include stack trace in development but not in production
  if (NODE_ENV === 'development') {
    stack = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: errorCode,
      stack
    }
  });
};

export default errorHandler; 