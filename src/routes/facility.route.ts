import express from "express";
import {
  createFacility,
  getAllFacilities,
  updateFacility,
  deleteFacility,
} from "../controllers/facility.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// POST /api/facilities
router.post("/", authenticate, authorize("admin", "principal"), createFacility);

// GET /api/facilities
router.get("/", getAllFacilities);

// PUT /api/facilities/:id
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateFacility
);

// DELETE /api/facilities/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteFacility
);

export default router;
