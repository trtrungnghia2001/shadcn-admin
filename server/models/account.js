import mongoose, { Schema } from "mongoose";

const accountSchema = new Schema(
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

export const AccountModel =
  mongoose.models.account || mongoose.model("account", accountSchema);

// export const
