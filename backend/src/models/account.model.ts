import mongoose, { Schema, Document, Types, Model } from "mongoose";

interface IAccount {
  userId: Types.ObjectId;
  provider: string;
  providerAccountId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface AccountDocument extends IAccount, Document {}

const AccountSchema = new Schema<AccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    collection: "accounts",
  }
);

// Compound index to ensure unique provider accounts per user
AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const AccountModel: Model<AccountDocument> =
  mongoose.models.AccountModel ||
  mongoose.model<AccountDocument>("AccountModel", AccountSchema);

export default AccountModel;
