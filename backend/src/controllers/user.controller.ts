import { Request, Response } from "express";
import { ApiResponse } from "../interfaces/response.interface.js";
import {
  getProfile,
  updateProfile,
  deleteAccount,
} from "../services/user.service.js";
import logger from "../../config/logger.config.js";

export const getProfileHandler = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user.id;
    const user = await getProfile(userId);

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("Get profile handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve profile",
      error: {
        code: "GET_PROFILE_FAILED",
      },
    });
  }
};

export const updateProfileHandler = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, ...extraParams } = req.body;

    // Check if there are any extra parameters in the request body
    if (Object.keys(extraParams).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Only firstName and lastName can be updated",
        error: {
          code: "INVALID_PARAMETERS",
          details: `Unexpected parameters: ${Object.keys(extraParams).join(', ')}`
        },
      });
    }

    const user = await updateProfile(userId, { firstName, lastName });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    logger.error("Update profile handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile",
      error: {
        code: "UPDATE_PROFILE_FAILED",
      },
    });
  }
};

export const deleteAccountHandler = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.params.userId;
    const { password } = req.body;

    await deleteAccount(userId, password);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    logger.error("Delete account handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete account",
      error: {
        code: "DELETE_ACCOUNT_FAILED",
      },
    });
  }
};

export const changeEmailHandler = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const userId = req.user.id;
    const { new_email } = req.body;

    if (!new_email) {
      return res.status(400).json({
        success: false,
        message: "New email is required",
        error: {
          code: "MISSING_EMAIL",
        },
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(new_email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        error: {
          code: "INVALID_EMAIL_FORMAT",
        },
      });
    }

    await updateProfile(userId, { email: new_email });

    res.json({
      success: true,
      message: "Email change initiated successfully",
    });
  } catch (error) {
    logger.error("Change email handler error:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to change email",
      error: {
        code: "CHANGE_EMAIL_FAILED",
      },
    });
  }
};
