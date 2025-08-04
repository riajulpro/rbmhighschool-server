import express from "express";
import {
  createVacation,
  getAllVacations,
  updateVacation,
  deleteVacation,
} from "../controllers/vacation.controller";

const router = express.Router();

// POST /api/facilities
router.post("/", createVacation);

// GET /api/facilities
router.get("/", getAllVacations);

// PUT /api/facilities/:id
router.put("/:id", updateVacation);

// DELETE /api/facilities/:id
router.delete("/:id", deleteVacation);

export default router;
