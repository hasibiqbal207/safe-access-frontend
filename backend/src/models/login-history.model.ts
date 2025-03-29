import mongoose, { Schema, Document, Model } from "mongoose";

interface ILoginHistory {
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
  ip: string;
  userAgent: string;
  location?: string;
  status: "success" | "failed";
  failureReason?: string;
  deviceInfo?: {
    browser: string;
    os: string;
    device: string;
  };
}

export interface LoginHistoryDocument extends ILoginHistory, Document {}

const LoginHistorySchema = new Schema<LoginHistoryDocument>(
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
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    location: String,
    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },
    failureReason: String,
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
    },
  },
  {
    collection: "login-history",
    timestamps: true,
  }
);

// Index for faster queries
LoginHistorySchema.index({ userId: 1, timestamp: -1 });

const LoginHistoryModel: Model<LoginHistoryDocument> =
  mongoose.models.LoginHistoryModel ||
  mongoose.model<LoginHistoryDocument>("LoginHistoryModel", LoginHistorySchema);

export default LoginHistoryModel;

