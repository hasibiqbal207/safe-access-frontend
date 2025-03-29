import mongoose, { Schema, Document, Model } from "mongoose";

interface IAuditLog {
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
  eventType: string;
  details: Record<string, any>;
  ip: string;
  userAgent: string;
}

export interface AuditLogDocument extends IAuditLog, Document {}

const AuditLogSchema = new Schema<AuditLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  {
    collection: "audit-logs",
    timestamps: true,
  }
);

// Index for faster queries
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ eventType: 1, timestamp: -1 });

const AuditLogModel: Model<AuditLogDocument> =
  mongoose.models.AuditLogModel ||
  mongoose.model<AuditLogDocument>("AuditLogModel", AuditLogSchema);

export default AuditLogModel;
