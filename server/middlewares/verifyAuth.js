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

    const decoded = await jwt.verify(token, ENV.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
