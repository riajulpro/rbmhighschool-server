import express from "express";
import {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  getLast5PhotoUrls,
} from "../controllers/gallery.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "principal"),
  createGalleryItem
);
router.get("/", getAllGalleryItems);
router.get("/slide-photos", getLast5PhotoUrls);
router.get("/:id", getGalleryItemById);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  updateGalleryItem
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteGalleryItem
);

export default router;
