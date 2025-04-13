import express from "express";

import {
  registerHandler,
  loginHandler,
  logoutHandler,
  logoutAllHandler,
  refreshTokenHandler,
} from "../../controllers/auth/auth.controller.js";

import {
  verifyEmailHandler,
  resendVerificationHandler,
} from "../../controllers/auth/verification.auth.controller.js";

import sessionRouter from "./session.auth.route.js";
import securityRouter from "./security.auth.route.js";
import passwordRouter from "./password.auth.route.js";
import twoFactorRouter from "./mfa.auth.route.js";

import { validateRequest } from "../../middlewares/validation.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
} from "../../validations/auth.validation.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

import { scheduleDataRetentionCleanup } from "../../services/auth/data-retention.service.js";

// Initialize data retention cleanup schedule
scheduleDataRetentionCleanup();

const router = express.Router();

// Public routes
router.post("/register", validateRequest(registerSchema), registerHandler);
router.post("/login", validateRequest(loginSchema), loginHandler);
router.post("/verify-email", validateRequest(verifyEmailSchema), verifyEmailHandler as express.RequestHandler);

// Email verification route
router.post("/resend-verification", authenticateToken as express.RequestHandler, resendVerificationHandler as express.RequestHandler);

// Logout routes
router.post("/logout", authenticateToken as express.RequestHandler, logoutHandler);
router.post("/logout-all", authenticateToken as express.RequestHandler, logoutAllHandler);

// Refresh token routes
router.post("/refresh", validateRequest(refreshTokenSchema), authenticateToken as express.RequestHandler, refreshTokenHandler as express.RequestHandler);

// User Session routes
router.use("/sessions", sessionRouter);

// Security routes
router.use("/security", securityRouter);

// Password Management routes
router.use("/password", passwordRouter);

// MFA routes
router.use("/mfa", twoFactorRouter);

export default router;
