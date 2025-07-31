import express from "express";
import {
  createFacility,
  getAllFacilities,
  updateFacility,
  deleteFacility,
} from "../controllers/facility.controller";

const router = express.Router();

// POST /api/facilities
router.post("/", createFacility);

// GET /api/facilities
router.get("/", getAllFacilities);

// PUT /api/facilities/:id
router.put("/:id", updateFacility);

// DELETE /api/facilities/:id
router.delete("/:id", deleteFacility);

export default router;
