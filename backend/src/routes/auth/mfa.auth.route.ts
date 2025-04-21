import express from "express";
import { setup2FAHandler, enable2FAHandler, verify2FAHandler, disable2FAHandler, generateBackupCodesHandler, verifyMFALoginHandler } from "../../controllers/auth/2fa.auth.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { verifyMFALoginSchema } from "../../validations/auth.validation.js";

const router = express.Router();

// 2FA Setup Routes
router.get("/setup", authenticateToken as express.RequestHandler, setup2FAHandler);
router.post("/enable", authenticateToken as express.RequestHandler, enable2FAHandler);
router.post("/disable", authenticateToken as express.RequestHandler, disable2FAHandler);

// 2FA Operations Routes
router.post("/verify", authenticateToken as express.RequestHandler, verify2FAHandler);
router.post("/generate-backup-codes", authenticateToken as express.RequestHandler, generateBackupCodesHandler);

// MFA Login Verification - public route, doesn't require authentication
router.post("/verify-login", validateRequest(verifyMFALoginSchema), verifyMFALoginHandler);

export default router;