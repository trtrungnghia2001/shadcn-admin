import express from "express";
import { UserModel } from "../models/user.js";
import upload from "../libs/multer.js";
import createHttpError from "http-errors";
import { exportArrayToExcel, parseExcelToArray } from "../helpers/utils.js";

const userRoute = express.Router();

userRoute.post(`/`, async (req, res, next) => {
  try {
    const body = req.body;
    const data = await UserModel.create(body);

    return res.status(201).json({
      message: "Created successfully!",
      data,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
userRoute.put(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const data = await UserModel.findByIdAndUpdate(id, body, { new: true });

    return res.status(200).json({
      message: "Updated successfully!",
      data,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
userRoute.delete(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await UserModel.findByIdAndDelete(id, { new: true });

    return res.status(200).json({
      message: "Deleted successfully!",
      data,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
userRoute.get(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await UserModel.findById(id).lean();

    return res.status(200).json({
      message: "Fetch successfully!",
      data,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
userRoute.get(`/`, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const skip = (page - 1) * limit + offset;

    const data = await UserModel.find().limit(limit).skip(skip);
    const totals = await UserModel.countDocuments();
    const totalPages = Math.ceil(totals / limit);

    return res.status(200).json({
      message: "Fetch successfully!",
      data,
      success: true,
      page,
      limit,
      offset,
      skip,
      totals,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
});
userRoute.post(`/import`, upload.single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return createHttpError.BadRequest("No file uploaded");

    const rows = await parseExcelToArray(file);

    const data = await UserModel.insertMany(rows);

    return res.status(201).json({
      message: "Imported successfully!",
      data,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
userRoute.post(`/export`, async (req, res, next) => {
  try {
    const data = await UserModel.find();

    const buffer = exportArrayToExcel(data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=users.xlsx");

    return res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default userRoute;
