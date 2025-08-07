import express from "express";
import {
  createHonoredStudent,
  getAllHonoredStudents,
  getHonoredStudentById,
  updateHonoredStudent,
  deleteHonoredStudent,
} from "../controllers/honoredStudent.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "principal"),
  createHonoredStudent
);
router.get("/", getAllHonoredStudents);
router.get("/:id", getHonoredStudentById);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateHonoredStudent
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteHonoredStudent
);

export default router;
