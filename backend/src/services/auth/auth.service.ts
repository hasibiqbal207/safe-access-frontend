import { UserDocument } from "../../models/user.model.js";
import { UserModel, VerificationTokenModel, LoginSessionModel } from "../../models/index.js";
import crypto from "crypto";
import logger from "../../../config/logger.config.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/token.util.js";
import { AppError } from "../../middlewares/error.middleware.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../../utils/resend.util.js";


interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterParams): Promise<UserDocument> => {
  try {
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: password,
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await VerificationTokenModel.create({
      userId: user._id,
      token,
      type: "emailVerification",
      expiresAt,
    });

    // Send verification email using Resend
    await sendVerificationEmail(email, firstName, token);

    return user;
  } catch (error) {
    logger.error("Registration failed:", error);
    throw error;
  }
};

export const login = async ({
  email,
  password,
  ipAddress,
  userAgent,
}: LoginParams) => {
  try {
    const user = await UserModel.findOne({ email }).select("+password");
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid credentials"); 
    }

    const accessToken = generateAccessToken( user._id );
    const refreshToken = generateRefreshToken(user._id);

    // Create login session
    await LoginSessionModel.create({
      userId: user._id,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
        is2FAEnabled: user.is2FAEnabled,
        role: user.role,
      } as { id: string; firstName: string; lastName: string; email: string; emailVerified: boolean; is2FAEnabled: boolean; role: string; },
      accessToken,
      refreshToken,
      requires2FA: user.is2FAEnabled,
    };
  } catch (error) {
    logger.error("Login failed:", error);
    throw error;
  }
};

export const logout = async (userId: string, refreshToken: string) => {
  try {
    await LoginSessionModel.deleteOne({ userId, refreshToken });
  } catch (error) {
    logger.error("Logout failed:", error);
    throw error;
  }
};

export const logoutAll = async (userId: string) => {
  try {
    await LoginSessionModel.deleteMany({ userId });
  } catch (error) {
    logger.error("Logout all failed:", error);
    throw error;
  }
};

export const refreshToken = async (oldRefreshToken: string, ipAddress: string, userAgent: string) => {
  try {
    // Verify and decode the refresh token
    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string | { userId: string }; type: string };

    if (decoded.type !== "refresh") {
      throw new AppError("Invalid token type", 401, "INVALID_TOKEN_TYPE");
    }
    // Find the session with this refresh token
    const session = await LoginSessionModel.findOne({ refreshToken: oldRefreshToken });
    
    if (!session) {
      throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
    // Validate that the session belongs to the user in the token
    const tokenUserId = typeof decoded.userId === 'object' && decoded.userId !== null ? decoded.userId.userId : decoded.userId;
    if (session.userId.toString() !== tokenUserId.toString()) {
      throw new AppError("Token mismatch", 401, "TOKEN_MISMATCH");
    }

    // Check if the session has expired
    if (session.expiresAt < new Date()) {
      await session.deleteOne();
      throw new AppError("Refresh token expired", 401, "TOKEN_EXPIRED");
    }

    // Get the user
    const user = await UserModel.findById(tokenUserId);
    
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update the session with the new refresh token
    session.refreshToken = newRefreshToken;
    session.ipAddress = ipAddress;
    session.userAgent = userAgent;
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await session.save();

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        emailVerified: user.emailVerified,
        is2FAEnabled: user.is2FAEnabled,
        role: user.role,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    logger.error("Refresh token failed:", error);
    throw error;
  }
};