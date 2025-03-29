import { Request, Response } from "express";
import { ApiResponse } from "../../interfaces/response.interface.js";
import logger from "../../../config/logger.config.js";
import { verifyEmail, resendVerificationEmail } from "../../services/auth/verification.auth.service.js";
import { logAuditEvent, AuditEventType } from "../../utils/audit-logger.util.js";

/**
 * Verify email with token
 * @route POST /api/auth/verify-email
 */
export const verifyEmailHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { verification_token } = req.body;

    if (!verification_token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
        error: {
          code: "TOKEN_REQUIRED",
        },
      });
    }

    const { userId, email } = await verifyEmail(verification_token);

    await logAuditEvent(
      userId,
      AuditEventType.EMAIL_VERIFIED,
      {
        email
      },
      req
    );

    res.json({
      success: true,
      message: "Email verification successful. You can now log in.",
    });
  } catch (error) {
    logger.error("Email verification handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Email verification failed",
      error: {
        code: "VERIFICATION_FAILED",
      },
    });
  }
};

/**
 * Resend verification email
 * @route POST /api/auth/resend-verification
 */
export const resendVerificationHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    
    const { email } = await resendVerificationEmail(userId);

    await logAuditEvent(
      userId,
      AuditEventType.VERIFICATION_EMAIL_RESENT,
      {
        email
      },
      req
    );

    res.json({
      success: true,
      message: "Verification email has been resent. Please check your inbox.",
    });
  } catch (error) {
    logger.error("Resend verification handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to resend verification email",
      error: {
        code: "RESEND_VERIFICATION_FAILED",
      },
    });
  }
}; 