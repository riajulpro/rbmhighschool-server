import { Request, Response } from "express";
import { ClassRoutine } from "../models/routine";

// Create
export const createClassRoutine = async (req: Request, res: Response) => {
  try {
    const routine = await ClassRoutine.create(req.body);
    res.status(201).json({ message: "Routine created", routine });
  } catch (error) {
    res.status(500).json({ message: "Failed to create routine", error });
  }
};

// Get all
export const getAllClassRoutines = async (_: Request, res: Response) => {
  try {
    const routines = await ClassRoutine.find().sort({ day: 1, startTime: 1 });
    res.json({ routines });
  } catch (error) {
    res.status(500).json({ message: "Failed to get routines", error });
  }
};

// Get one
export const getClassRoutineById = async (req: Request, res: Response) => {
  try {
    const routine = await ClassRoutine.findById(req.params.id);
    if (!routine) return res.status(404).json({ message: "Routine not found" });
    res.json({ routine });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch routine", error });
  }
};

// Update
export const updateClassRoutine = async (req: Request, res: Response) => {
  try {
    const updated = await ClassRoutine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Routine not found" });
    res.json({ message: "Routine updated", routine: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update routine", error });
  }
};

// Delete
export const deleteClassRoutine = async (req: Request, res: Response) => {
  try {
    const deleted = await ClassRoutine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Routine not found" });
    res.json({ message: "Routine deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete routine", error });
  }
};
