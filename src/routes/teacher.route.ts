import express from "express";
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// CRUD routes
router.post("/", authenticate, authorize("admin", "principal"), createTeacher);
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.put("/:id", authenticate, updateTeacher);
router.delete("/:id", authorize("admin", "principal"), deleteTeacher);

export default router;
