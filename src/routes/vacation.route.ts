import express from "express";
import {
  createVacation,
  getAllVacations,
  updateVacation,
  deleteVacation,
} from "../controllers/vacation.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// POST /api/facilities
router.post("/", authenticate, authorize("admin", "principal"), createVacation);

// GET /api/facilities
router.get("/", getAllVacations);

// PUT /api/facilities/:id
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateVacation
);

// DELETE /api/facilities/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteVacation
);

export default router;
