import crypto from "crypto";
import { UserModel, VerificationTokenModel } from "../../models/index.js";
import logger from "../../../config/logger.config.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { sendVerificationEmail } from "../../utils/resend.util.js";

/**
 * Verify email with token
 * @param token Verification token
 * @returns Object containing userId and email for audit logging
 */
export const verifyEmail = async (token: string): Promise<{ userId: string; email: string }> => {
  try {
    // Find the verification token
    const verificationToken = await VerificationTokenModel.findOne({
      token,
      type: "emailVerification",
    });

    if (!verificationToken) {
      throw new AppError("Invalid or expired verification token", 400, "INVALID_TOKEN");
    }

    // Check if token has expired
    if (verificationToken.expiresAt < new Date()) {
      await verificationToken.deleteOne();
      throw new AppError("Verification token has expired", 400, "TOKEN_EXPIRED");
    }

    // Find and update user
    const user = await UserModel.findById(verificationToken.userId);
    
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Check if email is already verified
    if (user.emailVerified) {
      await verificationToken.deleteOne();
      return { 
        userId: user._id.toString(),
        email: user.email
      };
    }

    // Mark email as verified
    user.emailVerified = true;
    await user.save();

    // Delete the verification token
    await verificationToken.deleteOne();

    return {
      userId: user._id.toString(),
      email: user.email
    };
  } catch (error) {
    logger.error("Email verification failed:", error);
    throw error;
  }
};

/**
 * Resend verification email
 * @param userId User ID
 * @returns Object containing email for audit logging
 */
export const resendVerificationEmail = async (userId: string): Promise<{ email: string }> => {
  try {
    // Find the user
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Check if email is already verified
    if (user.emailVerified) {
      throw new AppError("Email is already verified", 400, "EMAIL_ALREADY_VERIFIED");
    }

    // Delete any existing verification tokens for this user
    await VerificationTokenModel.deleteMany({
      userId: user._id,
      type: "emailVerification",
    });

    // Generate new verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await VerificationTokenModel.create({
      userId: user._id,
      token,
      type: "emailVerification",
      expiresAt,
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.firstName, token);

    return {
      email: user.email
    };
  } catch (error) {
    logger.error("Resending verification email failed:", error);
    throw error;
  }
};
