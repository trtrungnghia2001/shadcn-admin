import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  WEBSITE: process.env.WEBSITE,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_DB: process.env.MONGO_DB,
};
