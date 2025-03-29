import { Router } from "express";
import {
  getSessionsHandler,
  deleteAllSessionsHandler,
  deleteSessionHandler,
} from "../../controllers/auth/session.auth.controller.js";

const router = Router();

router.get("/", getSessionsHandler);
router.delete("/all", deleteAllSessionsHandler);
router.delete("/:sessionId", deleteSessionHandler);

export default router;
