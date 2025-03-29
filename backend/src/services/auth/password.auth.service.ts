import {
  UserModel,
  VerificationTokenModel,
  LoginSessionModel,
  PasswordResetAttemptModel
} from "../../models/index.js";
import { hash, compare } from "bcrypt";
import logger from "../../../config/logger.config.js";
import { AppError } from "../../middlewares/error.middleware.js";
import crypto from 'crypto';
import { sendPasswordResetEmail, sendPasswordChangedEmail, sendTemporaryPasswordEmail } from "../../utils/resend.util.js";
import { isPasswordBreached } from "../../utils/password.util.js";
import { generateSecurePassword } from "../../utils/crypto.util.js";

const MAX_ATTEMPTS = 3;
const ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

// Password history interface
interface PasswordHistory {
  hash: string;
  createdAt: Date;
}

const PASSWORD_HISTORY_LIMIT = 5;
const MIN_PASSWORD_LENGTH = 8;

export const forgotPassword = async (email: string, ipAddress: string) => {
  try {
    const recentAttempts = await PasswordResetAttemptModel.countDocuments({
      ipAddress,
      createdAt: { $gte: new Date(Date.now() - ATTEMPT_WINDOW) }
    });

    if (recentAttempts >= MAX_ATTEMPTS) {
      throw new AppError(
        "Too many reset attempts. Please try again later.",
        429,
        "TOO_MANY_REQUESTS"
      );
    }

    await PasswordResetAttemptModel.create({ ipAddress, email });

    const user = await UserModel.findOne({ email });
    if (!user) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    const existingToken = await VerificationTokenModel.findOne({
      userId: user._id,
      type: 'resetPassword',
      expiresAt: { $gt: new Date() }
    });

    if (existingToken) {
      throw new AppError(
        "Reset link already sent. Please check your email or wait before requesting again.",
        400,
        "RESET_LINK_ALREADY_SENT"
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000);

    await VerificationTokenModel.create({
      userId: user._id,
      token: hashedToken,
      type: 'resetPassword',
      expiresAt: tokenExpiry,
      createdByIp: ipAddress
    });
    
    await sendPasswordResetEmail(email, resetToken, ipAddress);

    logger.info(`Password reset requested for email: ${email} from IP: ${ipAddress}`);

    return true;
  } catch (error) {
    logger.error("Failed to process forgot password request:", error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const verificationToken = await VerificationTokenModel.findOne({
      token: hashedToken,
      type: "resetPassword",
    });

    if (!verificationToken) {
      throw new AppError("Invalid reset token", 400, "INVALID_RESET_TOKEN");
    }

    if (verificationToken.expiresAt < new Date()) {
      await verificationToken.deleteOne();
      throw new AppError("Reset token has expired", 400, "EXPIRED_RESET_TOKEN");
    }

    const hashedPassword = await hash(newPassword, 10);

    const user = await UserModel.findByIdAndUpdate(
      verificationToken.userId,
      { 
        password: hashedPassword,
        lastPasswordChange: new Date()
      },
      { new: true }
    );

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Delete all refresh tokens for this user (force logout from all devices)
    await LoginSessionModel.deleteMany({ userId: user._id });

    await verificationToken.deleteOne();

    // Return user information for audit logging
    return { 
      userId: user._id.toString(),
      email: user.email
    };
  } catch (error) {
    logger.error("Reset password failed:", error);
    throw error;
  }
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    const user = await UserModel.findById(userId).select("+password +passwordHistory");
    
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new AppError("Current password is incorrect", 401, "INVALID_PASSWORD");
    }

    // Validate new password
    await validatePassword(newPassword, user.passwordHistory);

    // Check if password has been compromised
    const isBreached = await isPasswordBreached(newPassword);
    if (isBreached) {
      throw new AppError(
        "This password has been found in data breaches. Please choose a different password.",
        400,
        "COMPROMISED_PASSWORD"
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password history
    const passwordHistory = [
      { hash: hashedPassword, createdAt: new Date() },
      ...(user.passwordHistory || []).slice(0, PASSWORD_HISTORY_LIMIT - 1)
    ];

    // Update user
    await UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
      passwordHistory,
      requirePasswordChange: false,
      lastPasswordChange: new Date()
    });

    // Invalidate other sessions
    await LoginSessionModel.deleteMany({ 
      userId,
      // _id: { $ne: currentSessionId } // Keep current session
    });

    // Send notification email
    await sendPasswordChangedEmail(user.email);

    // Return user information for audit logging
    return {
      email: user.email
    };
  } catch (error) {
    logger.error("Change password failed:", error);
    throw error;
  }
};

// Helper function to clean up old attempts
export const cleanupOldAttempts = async () => {
  try {
    await PasswordResetAttemptModel.deleteMany({
      createdAt: { $lt: new Date(Date.now() - ATTEMPT_WINDOW) }
    });
  } catch (error) {
    logger.error("Failed to cleanup old attempts:", error);
  }
};

// Helper functions
async function validatePassword(
  password: string,
  passwordHistory: PasswordHistory[]
) {
  // Check length
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      400,
      "INVALID_PASSWORD_LENGTH"
    );
  }

  // Check complexity
  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
  if (!complexityRegex.test(password)) {
    throw new AppError(
      "Password must contain uppercase, lowercase, number, and special character",
      400,
      "INVALID_PASSWORD_COMPLEXITY"
    );
  }

  // Check password history
  for (const historical of passwordHistory) {
    if (await compare(password, historical.hash)) {
      throw new AppError(
        "Password has been used recently. Please choose a different password.",
        400,
        "PASSWORD_PREVIOUSLY_USED"
      );
    }
  }
}

export const adminResetPassword = async (
  adminId: string,
  userId: string,
  mfaToken: string
) => {
  try {
    // Verify admin MFA
    // TODO: Implement proper MFA verification
    // const isValidMFA = await verifyAdminMFA(adminId, mfaToken);
    // if (!isValidMFA) {
    //   throw new AppError("Invalid MFA token", 401, "INVALID_MFA");
    // }

    // Generate temporary password
    const tempPassword = generateSecurePassword();
    const hashedPassword = await hash(tempPassword, 10);

    // Update user account
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        requirePasswordChange: true,
        lastPasswordReset: new Date(),
      },
      { new: true }
    );

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Invalidate all sessions
    await LoginSessionModel.deleteMany({ userId });

    // Send email with temporary password
    await sendTemporaryPasswordEmail(user.email, user.firstName, tempPassword);

    // Return user information for audit logging
    return {
      email: user.email
    };
  } catch (error) {
    logger.error("Admin password reset failed:", error);
    throw error;
  }
};
