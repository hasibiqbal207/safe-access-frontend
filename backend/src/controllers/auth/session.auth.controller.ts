import {
  getSessions,
  deleteLoginSession,
  deleteAllLoginSessions,
  getCurrentSessionId,
} from "../../services/auth/session.auth.service.js";
import { Request, Response } from "express";
import {
  ApiResponse,
  AuthResponse,
} from "../../interfaces/response.interface.js";
import logger from "../../../config/logger.config.js";
import { AppError } from "../../middlewares/error.middleware.js";

const getSessionsHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;

    const sessions = await getSessions(userId);

    res.json({
      success: true,
      message: "Sessions retrieved successfully",
      data: { sessions },
    });
  } catch (error) {
    logger.error("Get sessions handler error:", error);
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve sessions",
      error: {
        code: "GET_SESSIONS_FAILED",
      },
    });
  }
};

const deleteSessionHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    await deleteLoginSession(userId, sessionId);

    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    logger.error("Delete session handler error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while trying to delete the session",
      error: {
        code: "SESSION_DELETION_FAILED",
      },
    });
  }
};

const deleteAllSessionsHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    // Get the most recent session for this user
    const currentSessionId = await getCurrentSessionId(userId);

    if (!currentSessionId) {
      throw new AppError("No active session found", 400, "SESSION_NOT_FOUND");
    }

    const result = await deleteAllLoginSessions(userId, currentSessionId);

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} other sessions.`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    logger.error("Delete all sessions handler error:", error);
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while trying to delete other sessions",
      error: {
        code:
          error instanceof AppError
            ? error.code
            : "ALL_SESSIONS_DELETION_FAILED",
      },
    });
  }
};

export { getSessionsHandler, deleteSessionHandler, deleteAllSessionsHandler };
