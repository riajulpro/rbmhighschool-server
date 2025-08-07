import express from "express";
import {
  createAuthority,
  getAllAuthorities,
  updateAuthority,
  deleteAuthority,
} from "../controllers/authority.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

// POST /api/authorities
router.post(
  "/",
  authenticate,
  authorize("admin", "principal"),
  createAuthority
);

// GET /api/authorities
router.get("/", getAllAuthorities);

// PUT /api/authorities/:id
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateAuthority
);

// DELETE /api/authorities/:id
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteAuthority
);

export default router;
