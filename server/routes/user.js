import express from "express";
import { UserModel } from "../models/user.js";
import upload from "../libs/multer.js";
import createHttpError from "http-errors";
import { exportArrayToExcel, parseExcelToArray } from "../helpers/utils.js";
import { adminMiddleware } from "../middlewares/verifyAuth.js";
const userRoute = express.Router();
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
userRoute.get(`/export`, async (req, res, next) => {
  try {
    const data = await UserModel.find().lean();
    const exportData = data.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }));

    exportArrayToExcel(res, exportData, "users.xlsx");
  } catch (error) {
    next(error);
  }
});
userRoute.delete(`/`, adminMiddleware, async (req, res, next) => {
  try {
    const { ids } = req.body;

    const data = await UserModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: "Deleted selected successfully!",
      data,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});
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
userRoute.delete(`/:id`, adminMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await UserModel.findByIdAndDelete(id);

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

    const name = { $regex: req.query.name || "", $options: "i" };
    const filters = {
      $or: [{ firstName: name }, { lastName: name }, { username: name }],
    };

    // filter theo columnFilters
    if (req.query.status) {
      const statuses = req.query.status.split(",");
      filters.status = { $in: statuses };
    }

    if (req.query.role) {
      const roles = req.query.role.split(",");
      filters.role = { $in: roles };
    }

    const data = await UserModel.find(filters)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    const totals = await UserModel.countDocuments(filters);
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

export default userRoute;
