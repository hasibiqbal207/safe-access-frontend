import mongoose, { Schema, Document, Model } from "mongoose";
import { hash, genSalt, compare } from "bcrypt";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  is2FAEnabled: boolean;
  twoFASecret?: string;
  twoFABackupCodes?: string[];
  createdAt: Date;
  updatedAt: Date;
  role: string;
  passwordHistory: {
    hash: string;
    createdAt: Date;
  }[];
  requirePasswordChange: boolean;
  lastPasswordChange: Date;
  lastPasswordReset: Date;
}

export interface UserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minlength: [2, "First Name must be at least 2 characters long"],
      maxlength: [50, "First Name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
      minlength: [2, "Last Name must be at least 2 characters long"],
      maxlength: [50, "Last Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      // select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFASecret: {
      type: String,
      select: false,
    },
    twoFABackupCodes: {
      type: [String],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    passwordHistory: [{
      hash: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    requirePasswordChange: { type: Boolean, default: false },
    lastPasswordChange: { type: Date },
    lastPasswordReset: { type: Date }
  },
  {
    collection: "users",
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await genSalt(12);
      const hashedPassword = await hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Add before model creation
UserSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const exists = await UserModel.findOne({ email: this.email });
    if (exists) {
      throw new Error("Email already exists");
    }
  }
  next();
});

// Add after the schema definition but before model creation
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const UserModel: Model<UserDocument> =
  mongoose.models.UserModel ||
  mongoose.model<UserDocument>("UserModel", UserSchema);

export default UserModel;
