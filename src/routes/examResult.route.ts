import express from "express";
import {
  createExamResult,
  getAllExamResults,
  updateExamResult,
  deleteExamResult,
} from "../controllers/examResults.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// POST /api/facilities
router.post(
  "/",
  authenticate,
  authorize("admin", "principal"),
  createExamResult
);

// GET /api/facilities
router.get("/", getAllExamResults);

// PUT /api/facilities/:id
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateExamResult
);

// DELETE /api/facilities/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteExamResult
);

export default router;
