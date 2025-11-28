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

const app = express();
const server = http.createServer(app);

await connectDB();

await connectSocket(server);

app.use(
  cors({
    origin: ENV.WEBSITE,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));

app.use(`/auth`, authRoute);
app.use(`/chat`, authMiddleware, chatRouter);
app.use(`/users`, authMiddleware, userRoute);

app.get(`/`, (req, res) => {
  res.status(200).json(`Hello server`);
});

app.use((err, req, res, next) => {
  console.log({ err });

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
