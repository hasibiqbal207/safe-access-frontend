import { Request, Response } from "express";
import { ApiResponse } from "../../interfaces/response.interface.js";
import { getLoginHistory, getAuditLog } from "../../services/auth/security.auth.service.js";
import logger from "../../../config/logger.config.js";
import { exportSecurityData } from "../../services/auth/data-export.service.js";
import { AppError } from "../../middlewares/error.middleware.js";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import { logAuditEvent, AuditEventType } from "../../utils/audit-logger.util.js";

export const getLoginHistoryHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getLoginHistory(userId, { page, limit });

    res.json({
      success: true,
      message: "Login history retrieved successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Get login history error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve login history",
      error: {
        code: "LOGIN_HISTORY_RETRIEVAL_FAILED",
      },
    });
  }
};

export const getAuditLogHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAuditLog(userId, { page, limit });

    res.json({
      success: true,
      message: "Audit log retrieved successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Get audit log error:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve audit log",
      error: {
        code: "AUDIT_LOG_RETRIEVAL_FAILED",
      },
    });
  }
};

export const exportSecurityDataHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const format = (req.query.format as "csv" | "json") || "csv";

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new AppError("Invalid date range", 400, "INVALID_DATE_RANGE");
    }

    const result = await exportSecurityData(userId, startDate, endDate, format);

    // Log the security data export
    await logAuditEvent(
      userId,
      AuditEventType.SECURITY_DATA_EXPORTED,
      {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format,
      },
      req
    );

    // For CSV format, send files as attachments
    if (format === "csv") {
      // Create a zip file containing both CSVs
      const csvResult = result as {
        loginHistory: { filePath: string; fileName: string };
        auditLog: { filePath: string; fileName: string };
      };
      
      const zip = new AdmZip();
      zip.addLocalFile(csvResult.loginHistory.filePath);
      zip.addLocalFile(csvResult.auditLog.filePath);
      
      const zipFileName = `security-export-${userId}-${Date.now()}.zip`;
      const zipFilePath = path.join(__dirname, "../../../exports", zipFileName);
      zip.writeZip(zipFilePath);

      res.download(zipFilePath, zipFileName, (err) => {
        // Clean up files after sending
        fs.unlinkSync(csvResult.loginHistory.filePath);
        fs.unlinkSync(csvResult.auditLog.filePath);
        fs.unlinkSync(zipFilePath);
      });
    } else {
      // For JSON format, send the file
      const jsonResult = result as { filePath: string; fileName: string };
      res.download(jsonResult.filePath, jsonResult.fileName, (err) => {
        fs.unlinkSync(jsonResult.filePath);
      });
    }
  } catch (error) {
    logger.error("Security data export error:", error);
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      success: false,
      message: error instanceof Error ? error.message : "Export failed",
      error: {
        code: error instanceof AppError ? error.code : "EXPORT_FAILED",
      },
    });
  }
}; 