import { LoginSessionModel } from "../../models/index.js";
import { AppError } from "../../middlewares/error.middleware.js";
import logger from "../../../config/logger.config.js";

export const getSessions = async (userId: string) => {
  try {
    const sessions = await LoginSessionModel.find({ userId })
      .select("-refreshToken")
      .sort({ createdAt: -1 });

    return sessions;
  } catch (error) {
    logger.error("Get sessions failed:", error);
    throw error;
  }
};

export const deleteLoginSession = async (userId: string, sessionId: string) => {
  try {
    const session = await LoginSessionModel.findOne({
      _id: sessionId,
      userId,
    });

    if (!session) {
      throw new AppError("Session not found", 404, "SESSION_NOT_FOUND");
    }

    await session.deleteOne();
    return true;
  } catch (error) {
    logger.error("Delete session failed:", error);
    throw error;
  }
};

export const deleteAllLoginSessions = async (
  userId: string,
  currentSessionId: string
) => {
  try {
    const result = await LoginSessionModel.deleteMany({
      userId,
      _id: { $ne: currentSessionId },
    });

    if (result.deletedCount === 0) {
      throw new AppError(
        "No other active sessions found",
        404,
        "NO_OTHER_SESSIONS_FOUND"
      );
    }

    return {
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    logger.error("Delete all login sessions failed:", error);
    throw new AppError(
      "Failed to delete all other login sessions",
      500,
      "DELETE_ALL_SESSIONS_FAILED"
    );
  }
};

export const getCurrentSessionId = async (userId: string) => {
  const currentSession = await LoginSessionModel.findOne({
    userId,
  }).sort({ createdAt: -1 });

  return currentSession?._id?.toString();
};
