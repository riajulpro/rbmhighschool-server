import express from "express";
import {
  createVacancy,
  getAllVacancies,
  updateVacancy,
  deleteVacancy,
} from "../controllers/vacancy.controller";

const router = express.Router();

// POST /api/facilities
router.post("/", createVacancy);

// GET /api/facilities
router.get("/", getAllVacancies);

// PUT /api/facilities/:id
router.put("/:id", updateVacancy);

// DELETE /api/facilities/:id
router.delete("/:id", deleteVacancy);

export default router;
