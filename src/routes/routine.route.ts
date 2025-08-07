import express from "express";
import {
  createClassRoutine,
  getAllClassRoutines,
  getClassRoutineById,
  updateClassRoutine,
  deleteClassRoutine,
} from "../controllers/routine.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "principal", "teacher"),
  createClassRoutine
);
router.get("/", getAllClassRoutines);
router.get("/:id", getClassRoutineById);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  updateClassRoutine
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  deleteClassRoutine
);

export default router;
