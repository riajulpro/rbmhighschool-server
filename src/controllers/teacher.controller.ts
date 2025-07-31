import { Request, Response } from "express";
import { Teacher } from "../models/teacher"; // adjust path as needed

// Create a new teacher
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ message: "Teacher created successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Failed to create teacher", error });
  }
};

// Get all teachers
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find().populate("userId");
    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers", error });
  }
};

// Get a teacher by ID
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate("userId");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teacher", error });
  }
};

// Update a teacher by ID
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res
      .status(200)
      .json({ message: "Teacher updated successfully", teacher: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update teacher", error });
  }
};

// Delete a teacher by ID
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error });
  }
};
