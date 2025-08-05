import express from "express";
import {
  createResult,
  getResults,
  getResultByStudent,
  updateResult,
  deleteResult,
  getResultByStudentInfo,
} from "../controllers/result.controller";

const router = express.Router();

router.post("/", createResult);
router.post("/by-info", getResultByStudentInfo);
router.get("/", getResults);
router.get("/student/:studentId", getResultByStudent);
router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

export default router;
