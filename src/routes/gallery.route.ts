import express from "express";
import {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem,
  getLast5PhotoUrls,
} from "../controllers/gallery.controller";

const router = express.Router();

router.post("/", createGalleryItem);
router.get("/", getAllGalleryItems);
router.get("/slide-photos", getLast5PhotoUrls);
router.get("/:id", getGalleryItemById);
router.put("/:id", updateGalleryItem);
router.delete("/:id", deleteGalleryItem);

export default router;
