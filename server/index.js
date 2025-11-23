import express from "express";
import authRoute from "./routes/auth.js";
import { connectDB } from "./libs/mongodb.js";

await connectDB();
const app = express();

const PORT = 5000;

app.use(`/auth`, authRoute);

app.get(`/`, (req, res) => {
  res.status(200).json(`Hello server`);
});
app.listen(PORT, () => {
  console.log(`Server running is port:: `, PORT);
});
