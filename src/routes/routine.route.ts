import express from "express";
import {
  createClassRoutine,
  getAllClassRoutines,
  getClassRoutineById,
  updateClassRoutine,
  deleteClassRoutine,
} from "../controllers/routine.controller";

const router = express.Router();

router.post("/", createClassRoutine);
router.get("/", getAllClassRoutines);
router.get("/:id", getClassRoutineById);
router.put("/:id", updateClassRoutine);
router.delete("/:id", deleteClassRoutine);

export default router;
