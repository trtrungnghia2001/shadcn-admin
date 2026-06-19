import authRoute from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import http from "http";
import express from "express";
import { connectDB } from "./libs/mongodb.js";
import { ENV } from "./libs/env.js";
import chatRouter from "./routes/chat.js";
import { authMiddleware } from "./middlewares/verifyAuth.js";
import { connectSocket } from "./libs/socket.js";
import userRoute from "./routes/user.js";
import { loginLimiter } from "./libs/ratelimit.js";
import { connectRedis } from "./libs/redis.js";

const app = express();
const server = http.createServer(app);

await Promise.all([connectRedis(), connectSocket(server), connectDB()]);

app.use(
  cors({
    origin: ENV.WEBSITE,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));

app.use(`/auth`, loginLimiter, authRoute);
app.use(`/chat`, authMiddleware, chatRouter);
app.use(`/users`, loginLimiter, authMiddleware, userRoute);

app.get(`/`, (req, res) => {
  res.status(200).json(`Hello server`);
});

app.use((err, req, res, next) => {
  console.error({ err });

  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    status: status,
    message: message,
  });
});
server.listen(ENV.PORT, () => {
  console.log(`Socket running is port:: `, ENV.PORT);
});
