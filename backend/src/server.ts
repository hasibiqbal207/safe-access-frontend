import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "../config/database.config.js";
import routes from "./routes/index.js";
import swaggerDocs from "../config/swagger.config.js";
import morganMiddleware from "./middlewares/logger.middleware.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import { CORS_ORIGIN, PORT } from "./constants/env.js";

// Connect to the database
connectDB();

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(cookieParser());

// Logger middleware
app.use(morganMiddleware);

// Health check endpoint
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "healthy",
  });
});

// API routes
app.use("/api/v1", routes);

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  swaggerDocs(app, PORT);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});