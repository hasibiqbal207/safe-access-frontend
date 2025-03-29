import mongoose, { Schema, Document, Types, Model } from "mongoose";

interface IVerificationToken {
  userId: Types.ObjectId;
  token: string;
  type: "emailVerification" | "resetPassword";
  expiresAt: Date;
  createdAt: Date;
}

export interface VerificationTokenDocument
  extends IVerificationToken,
    Document {}

const VerificationTokenSchema = new Schema<VerificationTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["emailVerification", "resetPassword"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Document will be automatically deleted when expired
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "verificationTokens",
  }
);

const VerificationTokenModel: Model<VerificationTokenDocument> =
  mongoose.models.VerificationTokenModel ||
  mongoose.model<VerificationTokenDocument>(
    "VerificationTokenModel",
    VerificationTokenSchema
  );

export default VerificationTokenModel;
