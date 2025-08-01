import { Request, Response } from "express";
import { Authority } from "../models/authority";

// CREATE
export const createAuthority = async (req: Request, res: Response) => {
  try {
    const authority = new Authority(req.body);
    await authority.save();
    res.status(201).json(authority);
  } catch (error) {
    res.status(500).json({ message: "Failed to create authority", error });
  }
};

// READ ALL
export const getAllAuthorities = async (_req: Request, res: Response) => {
  try {
    const authorities = await Authority.find();
    res.status(200).json(authorities);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch authorities", error });
  }
};

// UPDATE
export const updateAuthority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Authority.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Authority not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update authority", error });
  }
};

// DELETE
export const deleteAuthority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Authority.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Authority not found" });
    res.status(200).json({ message: "Authority deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete authority", error });
  }
};
