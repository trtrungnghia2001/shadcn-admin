import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    avatar: String,
    email: String,
    password: String,
  },
  { timestamps: true }
);

export const UserModel =
  mongoose.models.user || mongoose.model("user", userSchema);
