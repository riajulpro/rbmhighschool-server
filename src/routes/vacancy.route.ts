import express from "express";
import {
  createVacancy,
  getAllVacancies,
  updateVacancy,
  deleteVacancy,
} from "../controllers/vacancy.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// POST /api/facilities
router.post("/", authenticate, authorize("admin", "principal"), createVacancy);

// GET /api/facilities
router.get("/", getAllVacancies);

// PUT /api/facilities/:id
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateVacancy
);

// DELETE /api/facilities/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteVacancy
);

export default router;
