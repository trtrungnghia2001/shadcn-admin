import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { ENV } from "../libs/env.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw createHttpError.Unauthorized(
        "Access Token not found. Please log in."
      );
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    // Token hết hạn
    if (error.name === "TokenExpiredError") {
      return next(
        createHttpError.Unauthorized("Token expired. Please log in again.")
      );
    }

    // Token không hợp lệ
    if (error.name === "JsonWebTokenError") {
      return next(
        createHttpError.Unauthorized("Invalid token. Please log in again.")
      );
    }

    next(error);
  }
};
export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(createHttpError.Unauthorized("User not authenticated."));
    }

    if (req.user.role !== "admin") {
      return next(createHttpError.Forbidden("Access denied. Admins only."));
    }

    next();
  } catch (error) {
    next(error);
  }
};
