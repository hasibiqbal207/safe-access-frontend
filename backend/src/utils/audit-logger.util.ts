import { Request } from "express";
import { createAuditLog } from "../services/auth/security.auth.service.js";
import logger from "../../config/logger.config.js";

/**
 * Standard event types for audit logging
 */
export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGOUT = "LOGOUT",
  LOGOUT_ALL = "LOGOUT_ALL",
  TOKEN_REFRESH = "TOKEN_REFRESH",
  
  // User account events
  USER_REGISTERED = "USER_REGISTERED",
  EMAIL_VERIFIED = "EMAIL_VERIFIED",
  VERIFICATION_EMAIL_RESENT = "VERIFICATION_EMAIL_RESENT",
  PASSWORD_CHANGED = "PASSWORD_CHANGED",
  PASSWORD_RESET_REQUESTED = "PASSWORD_RESET_REQUESTED",
  PASSWORD_RESET_COMPLETED = "PASSWORD_RESET_COMPLETED",
  PROFILE_UPDATED = "PROFILE_UPDATED",
  ACCOUNT_DELETED = "ACCOUNT_DELETED",
  
  // Admin actions
  ADMIN_PASSWORD_RESET = "ADMIN_PASSWORD_RESET",
  ADMIN_ACCOUNT_LOCKED = "ADMIN_ACCOUNT_LOCKED",
  ADMIN_ACCOUNT_UNLOCKED = "ADMIN_ACCOUNT_UNLOCKED",
  
  // Security events
  MFA_ENABLED = "MFA_ENABLED",
  MFA_DISABLED = "MFA_DISABLED",
  MFA_VERIFIED = "MFA_VERIFIED",
  MFA_FAILED = "MFA_FAILED",
  MFA_SETUP_INITIATED = "MFA_SETUP_INITIATED",
  MFA_ENABLED_FAILED = "MFA_ENABLED_FAILED",
  MFA_DISABLED_FAILED = "MFA_DISABLED_FAILED",
  MFA_BACKUP_CODES_GENERATED = "MFA_BACKUP_CODES_GENERATED",
  
  // Data access events
  SECURITY_DATA_EXPORTED = "SECURITY_DATA_EXPORTED",
  PERSONAL_DATA_EXPORTED = "PERSONAL_DATA_EXPORTED",
  
  // API key events
  API_KEY_CREATED = "API_KEY_CREATED",
  API_KEY_DELETED = "API_KEY_DELETED"
}

/**
 * Creates an audit log entry with proper error handling
 * 
 * @param userId The ID of the user who performed the action
 * @param eventType The type of event to log
 * @param details Additional details about the event
 * @param req Express request object to extract IP and user agent
 * @param targetUserId Optional ID of the user who was the target of the action (for admin actions)
 */
export async function logAuditEvent(
  userId: string,
  eventType: AuditEventType | string,
  details: Record<string, any>,
  req: Request,
  targetUserId?: string
): Promise<void> {
  try {
    // Include target user ID in details if provided
    if (targetUserId) {
      details.targetUserId = targetUserId;
    }
    
    await createAuditLog(
      userId,
      eventType,
      details,
      req.ip || "unknown",
      req.headers["user-agent"] as string || "unknown"
    );
  } catch (error) {
    // Log the error but don't throw it to prevent blocking the main flow
    logger.error(`Failed to create audit log for event ${eventType}:`, error);
  }
} 