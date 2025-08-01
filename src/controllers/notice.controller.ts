import { Request, Response } from "express";
import { Notice } from "../models/notice";

// Create
export const createNotice = async (req: Request, res: Response) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json({ message: "Notice created", notice });
  } catch (error) {
    res.status(500).json({ message: "Failed to create notice", error });
  }
};

// Get All
export const getAllNotices = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined;

    const query = Notice.find().sort({ createdAt: -1 });
    if (limit) {
      query.limit(limit);
    }

    const notices = await query;
    res.json({ notices });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notices", error });
  }
};

// Get One
export const getNoticeById = async (req: Request, res: Response) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json({ notice });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notice", error });
  }
};

// Update
export const updateNotice = async (req: Request, res: Response) => {
  try {
    const updated = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice updated", notice: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notice", error });
  }
};

// Delete
export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notice", error });
  }
};
