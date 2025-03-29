import express from "express";
import authRoutes from "./auth/auth.route.js";
import userRoutes from "./user.route.js";
import { securityEndpointsLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

router.use("/auth", securityEndpointsLimiter, authRoutes);
router.use("/users", securityEndpointsLimiter, userRoutes);

export default router;
