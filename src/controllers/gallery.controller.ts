import { Request, Response } from "express";
import { Gallery } from "../models/gallery";

// Create
export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const galleryItem = await Gallery.create(req.body);
    res.status(201).json({ message: "Gallery item created", galleryItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to create gallery item", error });
  }
};

// Read All
export const getAllGalleryItems = async (_: Request, res: Response) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json({ gallery: items });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gallery items", error });
  }
};

// Read One
export const getGalleryItemById = async (req: Request, res: Response) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ galleryItem: item });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch gallery item", error });
  }
};

// Update
export const updateGalleryItem = async (req: Request, res: Response) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Gallery item updated", galleryItem: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update gallery item", error });
  }
};

// Delete
export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Gallery item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete gallery item", error });
  }
};
