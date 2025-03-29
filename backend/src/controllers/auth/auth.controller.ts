import { Request, Response } from "express";
import { ApiResponse, AuthResponse } from "../../interfaces/response.interface.js";
import logger from "../../../config/logger.config.js";
import {
  register,
  login,
  logout,
  logoutAll,
  refreshToken,
} from "../../services/auth/auth.service.js";

import { createLoginHistory } from "../../services/auth/security.auth.service.js";
import { logAuditEvent, AuditEventType } from "../../utils/audit-logger.util.js";

export const registerHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await register({ firstName, lastName, email, password });

    // Log the registration event
    await logAuditEvent(
      user._id.toString(),
      AuditEventType.USER_REGISTERED,
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      req
    );

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification.",
      data: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Registration handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Registration failed",
      error: {
        code: "REGISTRATION_FAILED",
      },
    });
  }
};

export const loginHandler = async (
  req: Request,
  res: Response<AuthResponse>
) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || "";
    const userAgent = req.get("user-agent") || "";

    const result = await login({ email, password, ipAddress, userAgent });

    // Add login history
    await createLoginHistory(
      result.user.id,
      req.ip || "",
      req.headers["user-agent"] || "unknown",
      "success"
    );

    // Add audit log for successful login
    await logAuditEvent(
      result.user.id,
      AuditEventType.LOGIN_SUCCESS,
      {
        email: result.user.email,
      },
      req
    );

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    logger.error("Login handler error:", error);
    // If login fails
    await createLoginHistory(
      req.body.email,
      req.ip || "",
      req.headers["user-agent"] || "unknown",
      "failed",
      error instanceof Error ? error.message : "Unknown error"
    );

    // Try to get user ID if available from the email
    try {
      // Note: In a real implementation, you might want to look up the user ID from the email
      // For now, we'll just log with the email as a detail since we don't have the user ID
      await logAuditEvent(
        "unknown", // We don't have the user ID for failed logins
        AuditEventType.LOGIN_FAILED,
        {
          email: req.body.email,
          reason: error instanceof Error ? error.message : "Unknown error",
        },
        req
      );
    } catch (logError) {
      logger.error("Failed to log audit event for failed login:", logError);
    }

    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Login failed",
      error: {
        code: "LOGIN_FAILED",
      },
    });
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    const { refreshToken } = req.body;

    await logout(userId, refreshToken);

    // Log the logout event
    await logAuditEvent(
      userId,
      AuditEventType.LOGOUT,
      {
        sessionId: refreshToken.substring(0, 10) + "..." // Truncate for security
      },
      req
    );

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error("Logout handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Logout failed",
      error: {
        code: "LOGOUT_FAILED",
      },
    });
  }
};

export const logoutAllHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;

    await logoutAll(userId);

    // Log the logout all event
    await logAuditEvent(
      userId,
      AuditEventType.LOGOUT_ALL,
      { },
      req
    );

    res.json({
      success: true,
      message: "Logged out of all sessions successfully",
    });
  } catch (error) {
    logger.error("Logout all handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Logout all failed",
      error: {
        code: "LOGOUT_ALL_FAILED",
      },
    });
  }
};

export const refreshTokenHandler = async (
  req: Request,
  res: Response<AuthResponse>
) => {
  try {
    const { refreshToken: oldRefreshToken } = req.body;
    
    if (!oldRefreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
        error: {
          code: "REFRESH_TOKEN_REQUIRED",
        },
      });
    }

    const ipAddress = req.ip || "";
    const userAgent = req.get("user-agent") || "";

    const result = await refreshToken(oldRefreshToken, ipAddress, userAgent);

    // Log the token refresh event
    await logAuditEvent(
      result.user.id,
      AuditEventType.TOKEN_REFRESH,
      {
        oldToken: oldRefreshToken.substring(0, 10) + "..." // Truncate for security
      },
      req
    );

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Refresh token handler error:", error);
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to refresh token",
      error: {
        code: "REFRESH_TOKEN_FAILED",
      },
    });
  }
};

