import express from "express";
import authRoute from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectDB } from "./libs/mongodb.js";
import { ENV } from "./libs/env.js";

await connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));

const PORT = ENV.PORT || 5000;

app.use(`/auth`, authRoute);

app.get(`/`, (req, res) => {
  res.status(200).json(`Hello server`);
});
app.listen(PORT, () => {
  console.log(`Server running is port:: `, PORT);
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
