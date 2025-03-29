import { rateLimit } from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: "Too many password reset attempts, please try again later.",
    error: {
      code: "PASSWORD_RESET_LIMIT_EXCEEDED",
    },
  },
});

export const securityEndpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    message: "Too many requests, please try again later.",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
    },
  },
});

// const forgotPasswordHandler = [
//     // Apply rate limiting middleware
//     rateLimit({
//       windowMs: 60 * 60 * 1000, // 1 hour
//       max: 3, // limit each IP to 3 requests per windowMs
//       message: "Too many password reset requests. Please try again later.",
//     }),

// const adminResetPasswordHandler = [
//     validateAdminAuth, // Middleware to verify admin rights
//     validateMFA, // Middleware to verify MFA
//     rateLimit({
//       windowMs: 15 * 60 * 1000, // 15 minutes
//       max: 10, // limit each admin to 10 resets per window
//     }),

// const changePasswordHandler = [
//     rateLimit({
//       windowMs: 60 * 60 * 1000, // 1 hour
//       max: 5, // limit each IP to 5 password changes per hour
//     }),
