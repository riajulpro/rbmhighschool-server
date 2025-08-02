import express from "express";
import {
  createHonoredStudent,
  getAllHonoredStudents,
  getHonoredStudentById,
  updateHonoredStudent,
  deleteHonoredStudent,
} from "../controllers/honoredStudent.controller";

const router = express.Router();

router.post("/", createHonoredStudent);
router.get("/", getAllHonoredStudents);
router.get("/:id", getHonoredStudentById);
router.put("/:id", updateHonoredStudent);
router.delete("/:id", deleteHonoredStudent);

export default router;
