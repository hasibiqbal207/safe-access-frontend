import mongoose, { Schema, Document, Types, Model } from "mongoose";

interface ILoginSession {
  userId: Types.ObjectId;
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface LoginSessionDocument extends ILoginSession, Document {}

const LoginSessionSchema = new Schema<LoginSessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic cleanup of expired sessions
    },
  },
  {
    collection: "loginSessions",
  }
);

const LoginSessionModel: Model<LoginSessionDocument> =
  mongoose.models.LoginSessionModel ||
  mongoose.model<LoginSessionDocument>("LoginSessionModel", LoginSessionSchema);

export default LoginSessionModel;
