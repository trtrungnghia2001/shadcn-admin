import express from "express";
import { ChatModel } from "../models/chat.js";
import { AccountModel } from "../models/account.js";
import { getSocketId, io } from "../libs/socket.js";
import mongoose from "mongoose";

const chatRouter = express.Router();

chatRouter.post("/send", async (req, res, next) => {
  try {
    const body = req.body;
    const userId = req.user._id;

    const resp = await ChatModel.create({
      sender: userId,
      ...body,
      readBy: [userId],
    });

    const data = await ChatModel.findById(resp._id)
      .populate([`sender`, `receiver`])
      .lean();

    io.to(getSocketId(data.receiver._id.toString())).emit("chat-send", data);

    return res.status(201).json({
      message: `Send message successfully!`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/users", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const search = req.query.search || "";

    const data = await AccountModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userId) },
          name: { $regex: search, $options: "i" },
        },
      },

      {
        $lookup: {
          from: "chats",
          let: { uid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        {
                          $eq: ["$sender", new mongoose.Types.ObjectId(userId)],
                        },
                        { $eq: ["$receiver", "$$uid"] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$sender", "$$uid"] },
                        {
                          $eq: [
                            "$receiver",
                            new mongoose.Types.ObjectId(userId),
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },

            {
              $lookup: {
                from: "accounts",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
              },
            },
            { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },

            {
              $lookup: {
                from: "accounts",
                localField: "receiver",
                foreignField: "_id",
                as: "receiver",
              },
            },
            {
              $unwind: { path: "$receiver", preserveNullAndEmptyArrays: true },
            },
          ],
          as: "lastMessage",
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        },
      },

      {
        $addFields: {
          isRead: {
            $cond: [
              {
                $in: [
                  new mongoose.Types.ObjectId(userId),
                  { $ifNull: ["$lastMessage.readBy", []] },
                ],
              },
              true,
              false,
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      message: `Fetch successfully!`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

chatRouter.get("/users/message/:id", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const skip = (page - 1) * limit + offset;

    const { id } = req.params;
    const userId = req.user._id;

    await ChatModel.updateMany(
      {
        $or: [
          { sender: userId, receiver: id },
          { receiver: userId, sender: id },
        ],
      },
      {
        $addToSet: { readBy: userId },
      }
    );

    const data = await ChatModel.find({
      $or: [
        { sender: userId, receiver: id },
        { receiver: userId, sender: id },
      ],
    })
      .populate([`sender`, `receiver`])
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .skip(skip);

    const totals = await ChatModel.countDocuments({
      $or: [
        { sender: userId, receiver: id },
        { receiver: userId, sender: id },
      ],
    });
    const totalPages = Math.ceil(totals / limit);

    io.to(getSocketId(userId)).emit("chat-clickRead", id);

    return res.status(200).json({
      message: `Fetch successfully!`,
      data: data,
      page,
      limit,
      offset,
      totalPages,
      totals,
    });
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
