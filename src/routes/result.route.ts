import express from "express";
import {
  createResult,
  getResults,
  getResultByStudent,
  updateResult,
  deleteResult,
  getResultByStudentInfo,
} from "../controllers/result.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "principal", "teacher"),
  createResult
);
router.post("/by-info", getResultByStudentInfo);
router.get("/", getResults);
router.get("/student/:studentId", getResultByStudent);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  updateResult
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  deleteResult
);

export default router;
