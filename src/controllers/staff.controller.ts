import { Request, Response } from "express";
import { Staff } from "../models/staff";

// CREATE
export const createStaff = async (req: Request, res: Response) => {
  try {
    const authority = new Staff(req.body);
    await authority.save();
    res.status(201).json(authority);
  } catch (error) {
    res.status(500).json({ message: "Failed to create authority", error });
  }
};

// READ ALL
export const getAllAuthorities = async (_req: Request, res: Response) => {
  try {
    const authorities = await Staff.find();
    res.status(200).json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch authorities", error });
  }
};

// UPDATE
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Staff.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update authority", error });
  }
};

// DELETE
export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Staff.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Staff not found" });
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete authority", error });
  }
};
