import LoginHistoryModel from "../../models/login-history.model.js";
import AuditLogModel from "../../models/audit-log.model.js";
import { createObjectCsvWriter } from "csv-writer";
import { AppError } from "../../middlewares/error.middleware.js";
import logger from "../../../config/logger.config.js";
import path from "path";
import fs from "fs";

export const exportSecurityData = async (
  userId: string,
  startDate: Date,
  endDate: Date,
  format: "csv" | "json" = "csv"
) => {
  try {
    // Fetch data
    const [loginHistory, auditLog] = await Promise.all([
      LoginHistoryModel.find({
        userId,
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean(),
      AuditLogModel.find({
        userId,
        createdAt: { $gte: startDate, $lte: endDate },
      }).lean(),
    ]);

    const exportData = {
      loginHistory,
      auditLog,
      exportDate: new Date(),
      dateRange: { startDate, endDate },
    };

    if (format === "json") {
      return exportDataAsJson(exportData, userId);
    } else {
      return exportDataAsCsv(exportData, userId);
    }
  } catch (error) {
    logger.error("Data export failed:", error);
    throw new AppError("Failed to export data", 500, "DATA_EXPORT_FAILED");
  }
};

const exportDataAsJson = async (data: any, userId: string) => {
  const fileName = `security-export-${userId}-${Date.now()}.json`;
  const filePath = path.join(__dirname, "../../../exports", fileName);

  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));

  return { filePath, fileName };
};

const exportDataAsCsv = async (data: any, userId: string) => {
  const loginHistoryFile = `login-history-${userId}-${Date.now()}.csv`;
  const auditLogFile = `audit-log-${userId}-${Date.now()}.csv`;
  const exportDir = path.join(__dirname, "../../../exports");

  await fs.promises.mkdir(exportDir, { recursive: true });

  // Create CSV writers for both files
  const loginHistoryCsvWriter = createObjectCsvWriter({
    path: path.join(exportDir, loginHistoryFile),
    header: [
      { id: "timestamp", title: "Timestamp" },
      { id: "ip", title: "IP Address" },
      { id: "status", title: "Status" },
      { id: "userAgent", title: "User Agent" },
      { id: "location", title: "Location" },
    ],
  });

  const auditLogCsvWriter = createObjectCsvWriter({
    path: path.join(exportDir, auditLogFile),
    header: [
      { id: "timestamp", title: "Timestamp" },
      { id: "eventType", title: "Event Type" },
      { id: "ip", title: "IP Address" },
      { id: "userAgent", title: "User Agent" },
      { id: "details", title: "Details" },
    ],
  });

  // Write the data
  await Promise.all([
    loginHistoryCsvWriter.writeRecords(data.loginHistory),
    auditLogCsvWriter.writeRecords(data.auditLog),
  ]);

  return {
    loginHistory: { filePath: path.join(exportDir, loginHistoryFile), fileName: loginHistoryFile },
    auditLog: { filePath: path.join(exportDir, auditLogFile), fileName: auditLogFile },
  };
}; 