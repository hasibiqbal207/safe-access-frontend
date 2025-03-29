import LoginHistoryModel from "../../models/login-history.model.js";
import AuditLogModel from "../../models/audit-log.model.js";
import { AppError } from "../../middlewares/error.middleware.js";
import logger from "../../../config/logger.config.js";
import mongoose from "mongoose";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getLoginHistory = async (
  userId: string,
  options: PaginationOptions = {}
) => {
  try {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [loginHistory, total] = await Promise.all([
      LoginHistoryModel.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LoginHistoryModel.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
    ]);

    return {
      loginHistory,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  } catch (error) {
    logger.error("Get login history failed:", error);
    throw new AppError(
      "Failed to retrieve login history",
      500,
      "LOGIN_HISTORY_RETRIEVAL_FAILED"
    );
  }
};

export const getAuditLog = async (
  userId: string,
  options: PaginationOptions = {}
) => {
  try {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [auditLog, total] = await Promise.all([
      AuditLogModel.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLogModel.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
    ]);

    return {
      auditLog,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  } catch (error) {
    logger.error("Get audit log failed:", error);
    throw new AppError(
      "Failed to retrieve audit log",
      500,
      "AUDIT_LOG_RETRIEVAL_FAILED"
    );
  }
};

export const createLoginHistory = async (
  userId: string,
  ip: string,
  userAgent: string,
  status: 'success' | 'failed',
  failureReason?: string
) => {
  try {
    await LoginHistoryModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      ip,
      userAgent,
      status,
      failureReason,
    });
  } catch (error) {
    logger.error("Create login history failed:", error);
    // Don't throw error to prevent blocking the main flow
  }
};

export const createAuditLog = async (
  userId: string,
  eventType: string,
  details: Record<string, any>,
  ip: string,
  userAgent: string
) => {
  try {
    await AuditLogModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      eventType,
      details,
      ip,
      userAgent,
    });
  } catch (error) {
    logger.error("Create audit log failed:", error);
    // Don't throw error to prevent blocking the main flow
  }
}; 