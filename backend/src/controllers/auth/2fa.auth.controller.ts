import { Request, Response } from "express";
import logger from "../../../config/logger.config.js";
import { ApiResponse } from "../../interfaces/response.interface.js";
import { setup2FA, enable2FA, verify2FA, disable2FA, generateNewBackupCodes } from "../../services/auth/2fa.auth.service.js";
import { logAuditEvent, AuditEventType } from "../../utils/audit-logger.util.js";
import { UserModel } from "../../models/index.js";

export const setup2FAHandler = async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const userId = req.user.id;
      const result = await setup2FA(userId);
      
      // Log 2FA setup initiation
      await logAuditEvent(
        userId,
        AuditEventType.MFA_SETUP_INITIATED,
        { method: "app" },
        req
      );
  
      res.json({
        success: true,
        message: "2FA setup initiated successfully",
        data: result,
      });
    } catch (error) {
      logger.error("2FA setup handler error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "2FA setup failed",
        error: {
          code: "2FA_SETUP_FAILED",
        },
      });
    }
  };
  
  export const enable2FAHandler = async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const userId = req.user.id;
      const { token } = req.body;
  
      const result = await enable2FA(userId, token);
      
      // Log 2FA enablement
      await logAuditEvent(
        userId,
        AuditEventType.MFA_ENABLED,
        { method: "app" },
        req
      );
  
      res.json({
        success: true,
        message: "2FA enabled successfully",
        data: result,
      });
    } catch (error) {
      logger.error("2FA enable handler error:", error);
      
      // Log failed 2FA enablement attempt
      try {
        await logAuditEvent(
          req.user.id,
          AuditEventType.MFA_ENABLED_FAILED,
          { 
            reason: error instanceof Error ? error.message : "Unknown error" 
          },
          req
        );
      } catch (logError) {
        logger.error("Failed to log 2FA enablement failure:", logError);
      }
      
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to enable 2FA",
        error: {
          code: "2FA_ENABLE_FAILED",
        },
      });
    }
  };

  export const disable2FAHandler = async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const userId = req.user.id;
      const { password } = req.body;
  
      await disable2FA(userId, password);
      
      // Log 2FA disablement
      await logAuditEvent(
        userId,
        AuditEventType.MFA_DISABLED,
        {},
        req
      );
  
      res.json({
        success: true,
        message: "2FA disabled successfully",
      });
    } catch (error) {
      logger.error("2FA disable handler error:", error);
      
      // Log failed 2FA disablement attempt
      try {
        await logAuditEvent(
          req.user.id,
          AuditEventType.MFA_DISABLED_FAILED,
          { 
            reason: error instanceof Error ? error.message : "Unknown error" 
          },
          req
        );
      } catch (logError) {
        logger.error("Failed to log 2FA disablement failure:", logError);
      }
      
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to disable 2FA",
        error: {
          code: "2FA_DISABLE_FAILED",
        },
      });
    }
  };
  
  export const verify2FAHandler = async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const userId = req.user.id;
      const { token } = req.body;
  
      const isValid = await verify2FA(userId, token);
      if (!isValid) throw new Error("Invalid 2FA code");
      
      // Log successful 2FA verification
      await logAuditEvent(
        userId,
        AuditEventType.MFA_VERIFIED,
        {},
        req
      );
  
      res.json({
        success: true,
        message: "2FA verification successful",
      });
    } catch (error) {
      logger.error("2FA verification handler error:", error);
      
      // Log failed 2FA verification
      try {
        await logAuditEvent(
          req.user.id,
          AuditEventType.MFA_FAILED,
          { 
            reason: error instanceof Error ? error.message : "Unknown error" 
          },
          req
        );
      } catch (logError) {
        logger.error("Failed to log 2FA verification failure:", logError);
      }
      
      res.status(401).json({
        success: false,
        message:
          error instanceof Error ? error.message : "2FA verification failed",
        error: {
          code: "2FA_VERIFICATION_FAILED",
        },
      });
    }
  };
  
  export const generateBackupCodesHandler = async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const userId = req.user.id;
      const backupCodes = await generateNewBackupCodes(userId);

      // Log backup codes generation
      await logAuditEvent(
        userId,
        AuditEventType.MFA_BACKUP_CODES_GENERATED,
        {},
        req
      );

      res.json({
        success: true,
        message: "Backup codes generated successfully",
        data: { backupCodes },
      });
    } catch (error) {
      logger.error("Backup codes generation handler error:", error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to generate backup codes",
        error: {
          code: "BACKUP_CODES_GENERATION_FAILED",
        },
      });
    }
  };
  
  export const verifyMFALoginHandler = async (
    req: Request,
    res: Response<ApiResponse>
  ) => {
    try {
      const { token, email } = req.body;

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      // Verify the MFA token
      const isValid = await verify2FA(user._id.toString(), token);
      if (!isValid) {
        throw new Error("Invalid 2FA code");
      }
      
      // Log successful 2FA verification during login
      await logAuditEvent(
        user._id.toString(),
        AuditEventType.MFA_VERIFIED,
        { email: user.email },
        req
      );

      res.json({
        success: true,
        message: "2FA verification successful",
      });
    } catch (error) {
      logger.error("2FA login verification handler error:", error);
      
      // Try to get user for audit logging
      try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (user) {
          await logAuditEvent(
            user._id.toString(),
            AuditEventType.LOGIN_FAILED,
            { 
              reason: error instanceof Error ? error.message : "Unknown error",
              email: req.body.email
            },
            req
          );
        }
      } catch (logError) {
        logger.error("Failed to log 2FA login verification failure:", logError);
      }
      
      res.status(401).json({
        success: false,
        message:
          error instanceof Error ? error.message : "2FA verification failed",
        error: {
          code: "2FA_LOGIN_VERIFICATION_FAILED",
        },
      });
    }
  };
  
