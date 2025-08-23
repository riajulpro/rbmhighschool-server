import { Request, Response } from "express";
import { ExamResult } from "../models/result-statistics";

// CREATE
export const createExamResult = async (req: Request, res: Response) => {
  try {
    const {
      year,
      exam,
      totalExaminee,
      totalPassed,
      totalFailed,
      totalPassMale,
      totalPassFemale,
      totalAPlus,
      totalAGrade,
      totalAMinus,
      totalB,
      totalC,
      totalD,
    } = req.body;

    // ✅ Calculate percentages
    const totalPassPercentage =
      totalExaminee > 0 ? (totalPassed / totalExaminee) * 100 : 0;
    const totalFailPercentage =
      totalExaminee > 0 ? (totalFailed / totalExaminee) * 100 : 0;

    const examResult = new ExamResult({
      year,
      exam,
      totalExaminee,
      totalPassed,
      totalFailed,
      totalPassPercentage,
      totalFailPercentage,
      totalPassMale,
      totalPassFemale,
      totalAPlus,
      totalAGrade,
      totalAMinus,
      totalB,
      totalC,
      totalD,
    });

    await examResult.save();
    res.status(201).json(examResult);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create exam result", details: error });
  }
};

// READ ALL
export const getAllExamResults = async (_req: Request, res: Response) => {
  try {
    const facilities = await ExamResult.find().sort({ serial: 1 });
    res.status(200).json(facilities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch facilities", details: error });
  }
};

// UPDATE
export const updateExamResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await ExamResult.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "ExamResult not found" });
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update facility", details: error });
  }
};

// DELETE
export const deleteExamResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ExamResult.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ error: "ExamResult not found" });
    res.status(200).json({ message: "ExamResult deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete facility", details: error });
  }
};
