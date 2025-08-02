import express from "express";
import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admission.controller";
import { uploadAdmissionPhoto } from "../middlewares/upload";

const router = express.Router();

router.post("/", uploadAdmissionPhoto.single("photo"), createAdmission);
router.get("/", getAllAdmissions);
router.get("/:id", getAdmissionById);
router.put("/:id", uploadAdmissionPhoto.single("photo"), updateAdmission);
router.delete("/:id", deleteAdmission);

export default router;
