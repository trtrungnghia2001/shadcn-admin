import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB() {
  await mongoose
    .connect(ENV.MONGO_URL, {
      dbName: ENV.MONGO_DB,
    })
    .then((value) => {
      console.log(`Connect DB successfully!`);
    })
    .catch((error) => {
      console.error(`Connect DB failed!`);
      console.error({ error });
    });
}
