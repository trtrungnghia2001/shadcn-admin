import express from "express";
import { ChatModel } from "../models/chat.js";
import { UserModel } from "../models/user.js";
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

    const data = await UserModel.aggregate([
      // Bỏ user hiện tại
      {
        $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
      },

      // Tìm lastMessage
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

            // populate sender
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
              },
            },
            { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },

            // populate receiver
            {
              $lookup: {
                from: "users",
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

      // Lấy phần tử đầu tiên
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
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
      });

    io.to(getSocketId(userId)).emit("chat-click-read", userId);

    return res.status(200).json({
      message: `Fetch successfully!`,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

export default chatRouter;
