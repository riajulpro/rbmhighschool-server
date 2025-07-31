import { Request, Response } from "express";
import { Student } from "../models/student";

// ✅ Create a student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json({ message: "Student created", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Failed to create student", error });
  }
};

// ✅ Get all students with optional filters
export const getStudents = async (req: Request, res: Response) => {
  try {
    const { session, class: className, gender } = req.query;

    const filter: any = {};
    if (session) filter.session = session;
    if (className) filter.class = className;
    if (gender) filter.gender = gender;

    const students = await Student.find(filter).populate("userId");
    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: "Failed to get students", error });
  }
};

// ✅ Get a single student
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id).populate("userId");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: "Failed to get student", error });
  }
};

// ✅ Update a student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student updated", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error });
  }
};

// ✅ Delete a student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent)
      return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error });
  }
};
