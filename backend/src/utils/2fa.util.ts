import speakeasy from "speakeasy";
import QRCode from "qrcode";
import logger from "../../config/logger.config.js";
import crypto from "crypto";

export const generate2FASecret = (email: string) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `YourAppName:${email}`,
      issuer: "YourAppName",
    });

    return {
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32,
    };
  } catch (error) {
    logger.error("2FA secret generation failed:", error);
    throw error;
  }
};

export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    logger.error("QR code generation failed:", error);
    throw error;
  }
};

export const verifyTOTP = (token: string, secret: string): boolean => {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 1, // Allow 30 seconds window
    });
  } catch (error) {
    logger.error("TOTP verification failed:", error);
    throw error;
  }
};

export const generateBackupCodes = (count: number = 10): string[] => {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
}; 