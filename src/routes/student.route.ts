import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentGenderStatsByClass,
  getStudentNamesByClassAndSession,
} from "../controllers/student.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "principal", "teacher"),
  createStudent
); // Create
router.get("/", getStudents); // Get all with filters
router.get("/select", getStudentNamesByClassAndSession);
router.get("/stats", getStudentGenderStatsByClass); // Get stats by gender and class
router.get("/:id", getStudentById); // Get one
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  updateStudent
); // Update
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  deleteStudent
); // Delete

export default router;
