import { Router } from "express";
import express from "express";

import {
  getLoginHistoryHandler,
  getAuditLogHandler,
  exportSecurityDataHandler,
} from "../../controllers/auth/security.auth.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/login-history",
  authenticateToken as express.RequestHandler,
  getLoginHistoryHandler
);
router.get(
  "/audit-log",
  authenticateToken as express.RequestHandler,
  getAuditLogHandler
);
router.get(
  "/export",
  authenticateToken as express.RequestHandler,
  exportSecurityDataHandler
);

export default router;
