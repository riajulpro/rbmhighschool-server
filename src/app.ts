// src/app.ts
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import dotenv from "dotenv";

import rootRouter from "./routes/root.route";
import { notFound } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://rbmhighschool.vercel.app"],
  })
);
app.use(express.json());

connectDB();

// Routes
app.use("/", rootRouter);
app.use("/api/auth", require("./routes/auth.route").default);
app.use("/api/results", require("./routes/result.route").default);

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
