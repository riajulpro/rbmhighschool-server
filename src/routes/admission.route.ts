import express from "express";
import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admission.controller";
import { uploadAdmissionPhoto } from "../middlewares/upload";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post("/", uploadAdmissionPhoto.single("photo"), createAdmission);
router.get("/", getAllAdmissions);
router.get("/:id", getAdmissionById);
router.put("/:id", uploadAdmissionPhoto.single("photo"), updateAdmission);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteAdmission
);

export default router;
