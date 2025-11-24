import express from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";
import { signinSchema, signupSchema } from "../helpers/schema.js";
import { ENV } from "../libs/env.js";
import { authMiddleware } from "../middlewares/verifyAuth.js";

const authRoute = express.Router();

authRoute.post(`/signup`, async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = signupSchema.validate(body);
    if (error) {
      throw createHttpError.BadRequest(error.message);
    }

    const user = await UserModel.findOne({
      email: body.email,
    });

    if (user) {
      throw createHttpError.Conflict(`User already exists`);
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(body.password, salt);

    await UserModel.create({ ...body, password: hashPassword });

    return res.status(201).json({
      message: `Signup successfully!`,
    });
  } catch (error) {
    next(error);
  }
});

authRoute.post(`/signin`, async (req, res, next) => {
  try {
    const body = req.body;

    const { error } = signinSchema.validate(body);
    if (error) {
      throw createHttpError.BadRequest(error.message);
    }

    const user = await UserModel.findOne({
      email: body.email,
    }).lean();
    if (!user) {
      throw createHttpError.BadRequest(`Invalid email or password`);
    }

    const isMatchPassword = await bcrypt.compare(body.password, user.password);
    if (!isMatchPassword) {
      throw createHttpError.BadRequest(`Invalid email or password`);
    }

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.accessToken = accessToken;
    delete user.password;

    return res.status(200).json({
      message: `Signin successfully!`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

authRoute.post(`/signout`, async (req, res, next) => {
  try {
    return res.status(200).json({
      message: `Signout successfully!`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

authRoute.post(`/me/update`, authMiddleware, async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.user._id;
    const user = await UserModel.findByIdAndUpdate(userId, body, { new: true });

    return res.status(200).json({
      message: `Update successfully!`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
export default authRoute;
