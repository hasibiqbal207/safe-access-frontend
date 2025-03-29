import mongoose from "mongoose";
import logger from "./logger.config.js";
import dotenv from "dotenv";

dotenv.config();

// Define the type for the environment variable
const MONGODB_URI = process.env.MONGODB_URL; // Explicitly cast MONGODB_URI as string

// Create a function to connect to MongoDB
const connectDB = async (): Promise<void> => {
  try {
    // Ensure MONGODB_URI is available
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    await mongoose.connect(MONGODB_URI).then(() => {
      logger.info("MongoDB connected");
    });
  } catch (err: unknown) { // Use `unknown` type to catch the error and type it safely
    if (err instanceof Error) {
      logger.error(`DB Connection Fail | ${err.message}`);
    } else {
      logger.error("DB Connection Fail | Unknown error occurred");
    }
  }
};

export default connectDB;
