import express from "express";
import {
  createInstitutionInfo,
  updateInstitutionInfo,
  getInstitutionInfo,
} from "../controllers/institutionInfo.controller";

const router = express.Router();

router.get("/", getInstitutionInfo); // ✅ GET one (public)
router.post("/", createInstitutionInfo); // ✅ POST once only
router.put("/:id", updateInstitutionInfo); // ✅ UPDATE by ID

export default router;
