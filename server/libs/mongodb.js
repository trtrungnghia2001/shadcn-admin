import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(ENV.MONGO_URL, {
      dbName: ENV.MONGO_DB,
    });
    console.log(`Connect DB successfully!`);
  } catch (error) {
    console.error(`Connect DB failed!`);
    process.exit(1);
  }
}
