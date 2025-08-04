import { Request, Response } from "express";
import Vacancy from "../models/vacancy";

// CREATE
export const createVacancy = async (req: Request, res: Response) => {
  try {
    const facility = new Vacancy(req.body);
    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create facility", details: error });
  }
};

// READ ALL
export const getAllVacancies = async (_req: Request, res: Response) => {
  try {
    const facilities = await Vacancy.find().sort({ serial: 1 });
    res.status(200).json(facilities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch facilities", details: error });
  }
};

// UPDATE
export const updateVacancy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Vacancy.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Vacancy not found" });
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update facility", details: error });
  }
};

// DELETE
export const deleteVacancy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Vacancy.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Vacancy not found" });
    res.status(200).json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete facility", details: error });
  }
};
