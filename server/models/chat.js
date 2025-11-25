import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    message: String,
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ChatModel =
  mongoose.models.chat || mongoose.model("chat", chatSchema);
