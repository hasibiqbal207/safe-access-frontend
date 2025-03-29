import LoginHistoryModel from "../../models/login-history.model.js";
import AuditLogModel from "../../models/audit-log.model.js";
import logger from "../../../config/logger.config.js";
import cron from "node-cron";

const RETENTION_PERIOD_DAYS = {
  loginHistory: 90, // 3 months
  auditLog: 365, // 1 year
};

export const cleanupOldRecords = async () => {
  try {
    const loginHistoryDate = new Date();
    loginHistoryDate.setDate(loginHistoryDate.getDate() - RETENTION_PERIOD_DAYS.loginHistory);

    const auditLogDate = new Date();
    auditLogDate.setDate(auditLogDate.getDate() - RETENTION_PERIOD_DAYS.auditLog);

    // Delete old login history records
    const loginHistoryResult = await LoginHistoryModel.deleteMany({
      createdAt: { $lt: loginHistoryDate },
    });

    // Delete old audit log records
    const auditLogResult = await AuditLogModel.deleteMany({
      createdAt: { $lt: auditLogDate },
    });

    logger.info(`Cleaned up ${loginHistoryResult.deletedCount} login history records`);
    logger.info(`Cleaned up ${auditLogResult.deletedCount} audit log records`);

    return {
      loginHistoryDeleted: loginHistoryResult.deletedCount,
      auditLogDeleted: auditLogResult.deletedCount,
    };
  } catch (error) {
    logger.error("Data retention cleanup failed:", error);
    throw error;
  }
};

// Schedule cleanup to run daily at 2 AM
export const scheduleDataRetentionCleanup = () => {
  cron.schedule("0 2 * * *", async () => {
    try {
      await cleanupOldRecords();
    } catch (error) {
      logger.error("Scheduled data retention cleanup failed:", error);
    }
  });
}; 