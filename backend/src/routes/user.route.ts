import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import {
  getProfileHandler,
  updateProfileHandler,
  deleteAccountHandler,
  changeEmailHandler,
} from "../controllers/user.controller.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken as express.RequestHandler);

router.get("/profile", getProfileHandler as express.RequestHandler);
router.put("/profile", updateProfileHandler as express.RequestHandler);
router.put("/change-email", changeEmailHandler as express.RequestHandler);
router.delete("/delete/:userId", deleteAccountHandler as express.RequestHandler);

export default router;
