import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/index.js";
import logger from "../../config/logger.config.js";

interface JwtPayload {
  userId: string;
  type: "access" | "refresh";
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: {
          code: "AUTH_REQUIRED",
        },
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    const user = await UserModel.findById(decoded.userId) as { _id: string; role: string };
    if (!user) {
      throw new Error("User not found");
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    console.log("req.user", req.user);

    next();
  } catch (error) {
    logger.error("Authentication failed:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: {
        code: "INVALID_TOKEN",
      },
    });
  }
};
