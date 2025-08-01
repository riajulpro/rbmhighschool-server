import express from "express";
import {
  createAuthority,
  getAllAuthorities,
  updateAuthority,
  deleteAuthority,
} from "../controllers/authority.controller";

const router = express.Router();

// POST /api/authorities
router.post("/", createAuthority);

// GET /api/authorities
router.get("/", getAllAuthorities);

// PUT /api/authorities/:id
router.put("/:id", updateAuthority);

// DELETE /api/authorities/:id
router.delete("/:id", deleteAuthority);

export default router;
