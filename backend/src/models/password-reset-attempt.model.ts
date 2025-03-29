import mongoose, { Schema, Document, Model } from 'mongoose';

interface IPasswordResetAttempt {
  ipAddress: string;
  email: string;
  createdAt: Date;
}

export interface PasswordResetAttemptDocument extends IPasswordResetAttempt, Document {}

const passwordResetAttemptSchema = new Schema<PasswordResetAttemptDocument>(
  {
    ipAddress: {
      type: String,
      required: true,
      index: true
    },
    email: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600 // Automatically delete documents after 1 hour
    }
  },
  {
    collection: "passwordResetAttempts",
    timestamps: false
  }
);

const PasswordResetAttemptModel: Model<PasswordResetAttemptDocument> = 
  mongoose.models.PasswordResetAttempt ||
  mongoose.model<PasswordResetAttemptDocument>("PasswordResetAttempt", passwordResetAttemptSchema);

export default PasswordResetAttemptModel; 