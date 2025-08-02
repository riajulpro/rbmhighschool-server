import { Request, Response } from "express";
import { HonoredStudent } from "../models/honoredStudent";

// CREATE
export const createHonoredStudent = async (req: Request, res: Response) => {
  try {
    const newStudent = await HonoredStudent.create(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: "Failed to add honored student", error });
  }
};

// READ ALL
export const getAllHonoredStudents = async (_: Request, res: Response) => {
  try {
    const students = await HonoredStudent.find().sort({ createdAt: -1 });
    res.json({ honoredStudents: students });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch honored students", error });
  }
};

// READ ONE
export const getHonoredStudentById = async (req: Request, res: Response) => {
  try {
    const student = await HonoredStudent.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student", error });
  }
};

// UPDATE
export const updateHonoredStudent = async (req: Request, res: Response) => {
  try {
    const updated = await HonoredStudent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update", error });
  }
};

// DELETE
export const deleteHonoredStudent = async (req: Request, res: Response) => {
  try {
    const deleted = await HonoredStudent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error });
  }
};
