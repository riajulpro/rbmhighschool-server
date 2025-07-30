import { Request, Response } from "express";
import { InstitutionInfo } from "../models/institution";

// Create (only if none exists)
export const createInstitutionInfo = async (req: Request, res: Response) => {
  try {
    const exists = await InstitutionInfo.findOne();
    if (exists) {
      return res.status(400).json({
        message: "Institution info already exists. Use update instead.",
      });
    }

    const info = await InstitutionInfo.create(req.body);
    res.status(201).json({ message: "Institution info created", info });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create institution info", error });
  }
};

// Update by ID
export const updateInstitutionInfo = async (req: Request, res: Response) => {
  try {
    const updated = await InstitutionInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Institution info not found" });
    }

    res
      .status(200)
      .json({ message: "Institution info updated", info: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update institution info", error });
  }
};

// Get Institution Info (only one expected)
export const getInstitutionInfo = async (_req: Request, res: Response) => {
  try {
    const info = await InstitutionInfo.findOne();
    if (!info) {
      return res.status(404).json({ message: "Institution info not found" });
    }

    res.status(200).json({ info });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch institution info", error });
  }
};
