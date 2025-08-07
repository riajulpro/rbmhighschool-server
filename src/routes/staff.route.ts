import express from "express";
import {
  createStaff,
  getAllAuthorities,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// POST /api/authorities
router.post("/", authenticate, authorize("admin", "principal"), createStaff);

// GET /api/authorities
router.get("/", getAllAuthorities);

// PUT /api/authorities/:id
router.put("/:id", authenticate, authorize("admin", "principal"), updateStaff);

// DELETE /api/authorities/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteStaff
);

export default router;
