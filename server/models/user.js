import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    phoneNumber: String,
    status: String,
    role: String,
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.user || mongoose.model("user", userSchema);
