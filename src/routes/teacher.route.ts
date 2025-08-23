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
router.post(
  "/",
  authenticate,
  authorize("admin", "principal", "teacher"),
  createTeacher
);
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  updateTeacher
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteTeacher
);

export default router;
