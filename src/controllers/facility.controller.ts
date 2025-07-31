import { Request, Response } from "express";
import Facility from "../models/facility";

// CREATE
export const createFacility = async (req: Request, res: Response) => {
  try {
    const facility = new Facility(req.body);
    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create facility", details: error });
  }
};

// READ ALL
export const getAllFacilities = async (_req: Request, res: Response) => {
  try {
    const facilities = await Facility.find().sort({ serial: 1 });
    res.status(200).json(facilities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch facilities", details: error });
  }
};

// UPDATE
export const updateFacility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Facility.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Facility not found" });
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update facility", details: error });
  }
};

// DELETE
export const deleteFacility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Facility.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Facility not found" });
    res.status(200).json({ message: "Facility deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete facility", details: error });
  }
};
