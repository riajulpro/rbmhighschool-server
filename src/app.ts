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
app.use("/api/students", require("./routes/student.route").default);
app.use("/api/teachers", require("./routes/teacher.route").default);
app.use("/api/institution", require("./routes/institution.route").default);
app.use("/api/gallery", require("./routes/gallery.route").default);
app.use("/api/notices", require("./routes/notice.route").default);
app.use("/api/posts", require("./routes/post.route").default);
app.use("/api/routine", require("./routes/routine.route").default);
app.use("/api/facilities", require("./routes/facility.route").default);
app.use("/api/authorities", require("./routes/authority.route").default);
app.use("/api/staffs", require("./routes/staff.route").default);
app.use("/api/admissions", require("./routes/admission.route").default);
app.use(
  "/api/honored-students",
  require("./routes/honoredStudent.route").default
);

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
