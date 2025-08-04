import { Request, Response } from "express";
import Vacation from "../models/vacancy";

// CREATE
export const createVacation = async (req: Request, res: Response) => {
  try {
    const facility = new Vacation(req.body);
    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create facility", details: error });
  }
};

// READ ALL
export const getAllVacations = async (_req: Request, res: Response) => {
  try {
    const facilities = await Vacation.find().sort({ serial: 1 });
    res.status(200).json(facilities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch facilities", details: error });
  }
};

// UPDATE
export const updateVacation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Vacation.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Vacation not found" });
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update facility", details: error });
  }
};

// DELETE
export const deleteVacation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Vacation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Vacation not found" });
    res.status(200).json({ message: "Vacation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete facility", details: error });
  }
};
