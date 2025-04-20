import {
  getSessions,
  deleteLoginSession,
  deleteAllLoginSessions,
  getCurrentSessionId,
} from "../../services/auth/session.auth.service.js";
import { Request, Response } from "express";
import { ApiResponse } from "../../interfaces/response.interface.js";
import logger from "../../../config/logger.config.js";
import { AppError } from "../../middlewares/error.middleware.js";

const getSessionHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    
    // Get the current session ID
    const currentSessionId = await getCurrentSessionId(userId);
    
    if (!currentSessionId) {
      throw new AppError("No active session found", 400, "SESSION_NOT_FOUND");
    }
    
    // Get all sessions
    const allSessions = await getSessions(userId);
    
    // Find the current session
    const currentSession = allSessions.find(
      (session) => session._id.toString() === currentSessionId
    );
    
    if (!currentSession) {
      throw new AppError("Current session not found", 400, "SESSION_NOT_FOUND");
    }
    
    // Add isCurrent property to the current session
    const sessionWithCurrentFlag = {
      ...(currentSession.toJSON ? currentSession.toJSON() : currentSession),
      isCurrent: true
    };

    res.json({
      success: true,
      message: "Current session retrieved successfully",
      data: { session: sessionWithCurrentFlag },
    });
  } catch (error) {
    logger.error("Get session handler error:", error);
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve current session",
      error: {
        code: error instanceof AppError ? error.code : "GET_SESSION_FAILED",
      },
    });
  }
};

const getAllSessionsHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    
    // Get current session ID
    const currentSessionId = await getCurrentSessionId(userId);
    
    // Get all sessions
    const sessions = await getSessions(userId);
    
    // Mark current session
    const sessionsWithCurrentFlag = sessions.map(session => ({
      ...(session.toJSON ? session.toJSON() : session),
      isCurrent: session._id.toString() === currentSessionId
    }));

    res.json({
      success: true,
      message: "Sessions retrieved successfully",
      data: { sessions: sessionsWithCurrentFlag },
    });
  } catch (error) {
    logger.error("Get all sessions handler error:", error);
    res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve sessions",
      error: {
        code: "GET_ALL_SESSIONS_FAILED",
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

export { getSessionHandler, getAllSessionsHandler, deleteSessionHandler, deleteAllSessionsHandler };
