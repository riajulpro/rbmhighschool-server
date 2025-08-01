import express from "express";
import {
  createStaff,
  getAllAuthorities,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller";

const router = express.Router();

// POST /api/authorities
router.post("/", createStaff);

// GET /api/authorities
router.get("/", getAllAuthorities);

// PUT /api/authorities/:id
router.put("/:id", updateStaff);

// DELETE /api/authorities/:id
router.delete("/:id", deleteStaff);

export default router;
