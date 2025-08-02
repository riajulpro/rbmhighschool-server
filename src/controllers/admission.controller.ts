import { Request, Response } from "express";
import { Admission } from "../models/admission";

// CREATE Admission
export const createAdmission = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (req.file) {
      data.photo = req.file.filename;
    }

    const newAdmission = await Admission.create(data);
    res.status(201).json(newAdmission);
  } catch (error) {
    res.status(500).json({ message: "Failed to create admission", error });
  }
};

// GET All Admissions
export const getAllAdmissions = async (_: Request, res: Response) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admissions", error });
  }
};

// GET Single Admission
export const getAdmissionById = async (req: Request, res: Response) => {
  try {
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ message: "Not found" });
    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admission", error });
  }
};

// UPDATE Admission
export const updateAdmission = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (req.file) {
      data.photo = req.file.filename;
    }

    const updated = await Admission.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update admission", error });
  }
};

// DELETE Admission
export const deleteAdmission = async (req: Request, res: Response) => {
  try {
    const deleted = await Admission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Admission deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete admission", error });
  }
};
