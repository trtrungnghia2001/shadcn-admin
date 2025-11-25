import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    avatar: String,
    email: String,
    password: String,
    role: {
      type: String,
      default: "member",
      enum: ["member", "admin"],
    },
    dob: String,
    language: String,
    bio: String,
    urls: [
      {
        url: String,
      },
    ],
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.user || mongoose.model("user", userSchema);
