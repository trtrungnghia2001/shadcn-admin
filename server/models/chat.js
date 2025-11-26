import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "account",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "account",
    },
    message: String,
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "account",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ChatModel =
  mongoose.models.chat || mongoose.model("chat", chatSchema);
