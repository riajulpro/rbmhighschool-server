import express from "express";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentGenderStatsByClass,
} from "../controllers/student.controller";

const router = express.Router();

router.post("/", createStudent); // Create
router.get("/", getStudents); // Get all with filters
router.get("/stats", getStudentGenderStatsByClass); // Get stats by gender and class
router.get("/:id", getStudentById); // Get one
router.put("/:id", updateStudent); // Update
router.delete("/:id", deleteStudent); // Delete

export default router;
