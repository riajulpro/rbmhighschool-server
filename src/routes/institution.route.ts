import express from "express";
import {
  createInstitutionInfo,
  updateInstitutionInfo,
  getInstitutionInfo,
} from "../controllers/institutionInfo.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.get("/", getInstitutionInfo); // ✅ GET one (public)
router.post(
  "/",
  authenticate,
  authorize("admin", "principal"),
  createInstitutionInfo
); // ✅ POST once only
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateInstitutionInfo
); // ✅ UPDATE by ID

export default router;
