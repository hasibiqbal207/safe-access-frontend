import { Request, Response } from "express";
import { ApiResponse } from "../../interfaces/response.interface.js";
import logger from "../../../config/logger.config.js";
import {
  forgotPassword,
  resetPassword,
  changePassword,
  cleanupOldAttempts,
  adminResetPassword,
} from "../../services/auth/password.auth.service.js";
import { validateEmail } from "../../validations/helper.validation.js";
import { logAuditEvent, AuditEventType } from "../../utils/audit-logger.util.js";

// Run cleanup periodically
setInterval(cleanupOldAttempts, 60 * 60 * 1000); // Every hour

const forgotPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || "unknown";

    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
        error: {
          code: "INVALID_EMAIL",
        },
      });
    }

    await forgotPassword(email, ipAddress);

    // Log the password reset request
    // Note: We don't have userId here but we can log with email for tracking
    try {
      await logAuditEvent(
        "unknown", // We don't have the user ID here
        AuditEventType.PASSWORD_RESET_REQUESTED,
        {
          email,
          ipAddress,
        },
        req
      );
    } catch (logError) {
      logger.error("Failed to log password reset request:", logError);
    }

    res.json({
      success: true,
      message:
        "If your email is registered, you will receive password reset instructions",
    });
  } catch (error: any) {
    if (error.code === "TOO_MANY_REQUESTS") {
      return res.status(429).json({
        success: false,
        message: error.message,
        error: {
          code: error.code,
        },
      });
    }

    logger.error("Failed to process forgot password request:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to process password reset request",
      error: {
        code: error.code || "PASSWORD_RESET_REQUEST_FAILED",
      },
    });
  }
};

const resetPasswordHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { token, newPassword } = req.body;

    // resetPassword should return user info after successful password reset
    const { userId, email } = await resetPassword(token, newPassword);

    // Log the password reset completion
    await logAuditEvent(
      userId,
      AuditEventType.PASSWORD_RESET_COMPLETED,
      {
        email,
        method: "self-service",
      },
      req
    );

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error("Failed to reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: {
        code: "PASSWORD_RESET_FAILED",
      },
    });
  }
};

const adminResetPasswordHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { userId } = req.params;
    const { mfaToken } = req.body;
    const adminId = req.user.id;

    // adminResetPassword should return user info after successful reset
    const { email } = await adminResetPassword(adminId, userId, mfaToken);

    // Log the admin password reset
    await logAuditEvent(
      adminId,
      AuditEventType.ADMIN_PASSWORD_RESET,
      {
        targetUserId: userId,
        targetEmail: email,
      },
      req,
      userId // This is important to link the action to the target user
    );

    res.json({
      success: true,
      message: "Password reset successful. User has been notified.",
    });
  } catch (error: any) {
    logger.error("Admin password reset failed:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to reset password",
      error: {
        code: error.code || "PASSWORD_RESET_FAILED",
      },
    });
  }
};

const changePasswordHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
        error: {
          code: "PASSWORD_MISMATCH",
        },
      });
    }

    // changePassword should return user email after successful change
    const { email } = await changePassword(userId, currentPassword, newPassword);

    // Log the password change
    await logAuditEvent(
      userId,
      AuditEventType.PASSWORD_CHANGED,
      {
        email,
        method: "self-service",
      },
      req
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    logger.error("Password change failed:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to change password",
      error: {
        code: error.code || "PASSWORD_CHANGE_FAILED",
      },
    });
  }
};

export {
  forgotPasswordHandler,
  resetPasswordHandler,
  adminResetPasswordHandler,
  changePasswordHandler,
};
