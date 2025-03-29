/**
 * Custom error class for application errors with status code and optional error code
 */
class AppError extends Error {
  statusCode: number;
  code?: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    // Captures the stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError; 