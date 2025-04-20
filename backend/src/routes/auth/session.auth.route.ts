import { Router } from "express";
import {
  getSessionHandler,
  getAllSessionsHandler,
  deleteAllSessionsHandler,
  deleteSessionHandler,
} from "../../controllers/auth/session.auth.controller.js";

const router = Router();

router.get("/", getSessionHandler);
router.get("/all", getAllSessionsHandler);
router.delete("/all", deleteAllSessionsHandler);
router.delete("/:sessionId", deleteSessionHandler);

export default router;
