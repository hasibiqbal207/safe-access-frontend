import express, { Router } from "express";
import {
  forgotPasswordHandler,
  resetPasswordHandler,
  changePasswordHandler,
} from "../../controllers/auth/password.auth.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes - no authentication needed
router.post("/forgot-password", forgotPasswordHandler as express.RequestHandler);
router.post("/reset-password", resetPasswordHandler as express.RequestHandler);

// Protected route - requires authentication
router.put("/change-password", authenticateToken as express.RequestHandler, changePasswordHandler as express.RequestHandler);

export default router;
