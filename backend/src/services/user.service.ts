import { UserModel } from "../models/index.js";
import logger from "../../config/logger.config.js";

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: boolean;
}

export const getProfile = async (userId: string) => {
  try {
    const user = await UserModel.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    logger.error("Get profile failed:", error);
    throw error;
  }
};

export const updateProfile = async (userId: string, data: UpdateProfileData) => {
  try {
    // If email is being updated, verify it's not already in use
    if (data.email) {
      const existingUser = await UserModel.findOne({ 
        email: data.email,
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        throw new Error("Email already in use");
      }
      
      // Reset email verification if email is changed
      data = {
        ...data,
        emailVerified: false,
      };
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    ).select("-password");

    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    logger.error("Update profile failed:", error);
    throw error;
  }
};

export const deleteAccount = async (userId: string, password: string) => {
  try {
    const user = await UserModel.findById(userId).select("+password");
    if (!user) throw new Error("User not found");

    const isValid = await user.comparePassword(password);
    if (!isValid) throw new Error("Invalid password");

    // Delete all related data
    await Promise.all([
      UserModel.findByIdAndDelete(userId),
      // Add other cleanup operations here (sessions, tokens, etc.)
    ]);

    return true;
  } catch (error) {
    logger.error("Delete account failed:", error);
    throw error;
  }
}; 