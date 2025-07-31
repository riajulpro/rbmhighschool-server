import { Request, Response } from "express";
import { Result } from "../models/result";
import { getGradeAndPoint, getOverallGradeFromGPA } from "../utils/gradeUtils";
import { Types } from "mongoose";
import { Student } from "../models/student";

export const createResult = async (req: Request, res: Response) => {
  try {
    const { student, semester, year, subjects } = req.body;

    let totalPoints = 0;
    let failed = false;

    const updatedSubjects = subjects.map((sub: any) => {
      const { grade, point } = getGradeAndPoint(sub.marks);
      if (point === 0) failed = true;
      totalPoints += point;
      return { ...sub, grade, point };
    });

    const gpa = parseFloat((totalPoints / subjects.length).toFixed(2));
    // const overallGrade = failed ? "F" : getGradeAndPoint(gpa * 20).grade;
    const overallGrade = failed ? "F" : getOverallGradeFromGPA(gpa);

    const result = await Result.create({
      student,
      semester,
      year,
      subjects: updatedSubjects,
      gpa,
      overallGrade,
    });

    return res.status(201).json({ message: "Result created", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to create result", error });
  }
};

export const getResults = async (_req: Request, res: Response) => {
  try {
    // const results = await Result.find().populate("student");
    const results = await Result.find().populate("student");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results", error });
  }
};

export const getResultByStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;
    const results = await Result.find({ student: studentId }).populate(
      "student"
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch result", error });
  }
};

export const updateResult = async (req: Request, res: Response) => {
  try {
    const resultId = req.params.id;
    const {
      student,
      semester,
      year,
      subjects: incomingSubjects = [],
    } = req.body;

    const existingResult = await Result.findById(resultId);
    if (!existingResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Convert incomingSubjects to a Map for quick lookup
    const incomingSubjectMap = new Map(
      incomingSubjects.map((s: any) => [s.subject.toLowerCase(), s.marks])
    );

    // Update existing subjects with new marks if provided
    const updatedSubjects = existingResult.subjects.map((existingSub: any) => {
      const subName = existingSub.subject.toLowerCase();
      const newMarks = incomingSubjectMap.has(subName)
        ? incomingSubjectMap.get(subName)
        : existingSub.marks;

      const { grade, point } = getGradeAndPoint(newMarks);

      return {
        subject: existingSub.subject,
        marks: newMarks,
        grade,
        point,
      };
    });

    // Optionally: Add new subjects that are not already in the existing list
    for (const incomingSub of incomingSubjects) {
      const exists = updatedSubjects.some(
        (s: any) =>
          s.subject.toLowerCase() === incomingSub.subject.toLowerCase()
      );
      if (!exists) {
        const { grade, point } = getGradeAndPoint(incomingSub.marks);
        updatedSubjects.push({
          subject: incomingSub.subject,
          marks: incomingSub.marks,
          grade,
          point,
        });
      }
    }

    // Recalculate GPA and overall grade
    let totalPoints = 0;
    let failed = false;
    updatedSubjects.forEach((sub: any) => {
      totalPoints += sub.point;
      if (sub.point === 0) failed = true;
    });

    const gpa = parseFloat((totalPoints / updatedSubjects.length).toFixed(2));
    const overallGrade = failed ? "F" : getOverallGradeFromGPA(gpa);

    // Update result document
    const updated = await Result.findByIdAndUpdate(
      resultId,
      {
        student: student ?? existingResult.student,
        semester: semester ?? existingResult.semester,
        year: year ?? existingResult.year,
        subjects: updatedSubjects,
        gpa,
        overallGrade,
      },
      { new: true }
    );

    res.json({ message: "Result updated successfully", result: updated });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update result", error });
  }
};

export const deleteResult = async (req: Request, res: Response) => {
  try {
    const resultId = req.params.id;
    await Result.findByIdAndDelete(resultId);
    res.json({ message: "Result deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete result", error });
  }
};

export const getResultByStudentInfo = async (req: Request, res: Response) => {
  try {
    const { class: studentClass, session, rollNumber } = req.body;

    // Step 1: Find student by class, session, and rollNumber
    const student = await Student.findOne({
      class: studentClass,
      session,
      rollNumber,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Step 2: Find results by student._id
    const results = await Result.find({ student: student._id }).populate(
      "student"
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No result found for this student" });
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Fetch Error:", error);
    return res.status(500).json({ message: "Failed to fetch result", error });
  }
};
