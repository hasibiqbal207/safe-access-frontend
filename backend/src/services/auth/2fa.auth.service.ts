import UserModel from "../../models/user.model.js";
import { generate2FASecret, generateQRCode, verifyTOTP, generateBackupCodes } from "../../utils/2fa.util.js";
import logger from "../../../config/logger.config.js";

export const setup2FA = async (userId: string) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user) throw new Error("User not found");
  
      const { otpauthUrl, base32 } = generate2FASecret(user.email);
      const qrCodeUrl = await generateQRCode(otpauthUrl as string);
      
      // Store the secret temporarily (you might want to use Redis for this)
      await UserModel.findByIdAndUpdate(userId, {
        twoFASecret: base32,
        is2FAEnabled: false,
      });
  
      return { qrCodeUrl, secret: base32 };
    } catch (error) {
      logger.error("2FA setup failed:", error);
      throw error;
    }
  };
  
  export const enable2FA = async (userId: string, token: string) => {
    try {
      const user = await UserModel.findById(userId).select("+twoFASecret");
      if (!user || !user.twoFASecret) throw new Error("Invalid setup");
  
      const isValid = verifyTOTP(token, user.twoFASecret);
      if (!isValid) throw new Error("Invalid 2FA code");
  
      const backupCodes = generateBackupCodes();
      
      await UserModel.findByIdAndUpdate(userId, {
        is2FAEnabled: true,
        twoFABackupCodes: backupCodes,
      });
  
      return { backupCodes };
    } catch (error) {
      logger.error("2FA enable failed:", error);
      throw error;
    }
  };
  
  export const verify2FA = async (userId: string, token: string) => {
    try {
      const user = await UserModel.findById(userId).select("+twoFASecret +twoFABackupCodes");
      if (!user || !user.twoFASecret) throw new Error("2FA not set up");
  
      // Check if it's a backup code
      if (user.twoFABackupCodes?.includes(token)) {
        await UserModel.findByIdAndUpdate(userId, {
          $pull: { twoFABackupCodes: token },
        });
        return true;
      }
  
      // Verify TOTP
      return verifyTOTP(token, user.twoFASecret);
    } catch (error) {
      logger.error("2FA verification failed:", error);
      throw error;
    }
  };
  
  export const disable2FA = async (userId: string, password: string) => {
    try {
      const user = await UserModel.findById(userId).select("+password");
      if (!user) throw new Error("User not found");
  
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) throw new Error("Invalid password");
  
      await UserModel.findByIdAndUpdate(userId, {
        is2FAEnabled: false,
        twoFASecret: null,
        twoFABackupCodes: [],
      });
  
      return true;
    } catch (error) {
      logger.error("2FA disable failed:", error);
      throw error;
    }
  };
  
  export const generateNewBackupCodes = async (userId: string) => {
    try {
      const user = await UserModel.findById(userId);
      if (!user || !user.is2FAEnabled) {
        throw new Error("2FA must be enabled to generate backup codes");
      }

      const backupCodes = generateBackupCodes();
      
      await UserModel.findByIdAndUpdate(userId, {
        twoFABackupCodes: backupCodes,
      });

      return backupCodes;
    } catch (error) {
      logger.error("Backup codes generation failed:", error);
      throw error;
    }
  };
  