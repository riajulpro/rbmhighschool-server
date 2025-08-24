import { Request, Response } from "express";
import { Result } from "../models/result";
import { Student } from "../models/student";
import { evaluateSubject } from "../utils/evaluate-subjects";
import { AnySubject, evaluateOneSubject } from "../utils/evaluate-one-subject";

// Utility to convert GPA to grade
function getOverallGradeFromGPA(gpa: number): string {
  if (gpa === 5) return "A+";
  if (gpa >= 4) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3) return "B";
  if (gpa >= 2) return "C";
  if (gpa >= 1) return "D";
  return "F";
}

// Compute final GPA from all subjects
function computeFinalGPA(subjects: { point: number }[]) {
  if (!subjects.length) return { gpa: 0, anyFail: true };

  let gpSum = 0;
  let anyFail = false;

  subjects.forEach((s) => {
    if (s.point === 0) anyFail = true;
    gpSum += s.point;
  });

  const avg = gpSum / subjects.length;
  const gpa = anyFail
    ? 0.0
    : Math.max(0, Math.min(5, parseFloat(avg.toFixed(2))));
  return { gpa, anyFail };
}

// CREATE RESULT
export const createResult = async (req: Request, res: Response) => {
  try {
    const { student, semester, year, subjects } = req.body as {
      student: string;
      semester: "FirstSemester" | "MidTerm" | "Annual";
      year: number | string;
      subjects: AnySubject[];
    };

    let failed = false;
    const updatedSubjects: any[] = [];

    // Group subjects by base name
    const subjectGroups: Record<string, AnySubject[]> = {};
    subjects.forEach((sub) => {
      const baseName = sub.subject
        .replace(/First Paper|Second Paper/gi, "")
        .trim();
      if (!subjectGroups[baseName]) subjectGroups[baseName] = [];
      subjectGroups[baseName].push(sub);
    });

    for (const base in subjectGroups) {
      const papers = subjectGroups[base];

      if (papers.length === 2) {
        // Extract marks
        let written1 = papers[0]?.marks?.written?.score || 0;
        let mcq1 = papers[0]?.marks?.mcq?.score || 0;
        let written2 = papers[1]?.marks?.written?.score || 0;
        let mcq2 = papers[1]?.marks?.mcq?.score || 0;

        const W_PASS = Math.ceil(
          (papers[0]?.marks?.written?.outOf || 0) * 0.33
        );
        const M_PASS = Math.ceil((papers[0]?.marks?.mcq?.outOf || 0) * 0.33);

        // Pass check first
        const failFirst = written1 < W_PASS || mcq1 < M_PASS;
        const failSecond = written2 < W_PASS || mcq2 < M_PASS;

        if (failFirst || failSecond) {
          updatedSubjects.push(
            ...papers.map((paper) => ({
              subject: paper.subject,
              marks: paper.marks,
              grade: "F",
              point: 0,
              comments: paper.comments || "",
            }))
          );
          failed = true;
        } else {
          // Both passed → apply mark sharing
          let newWritten1 = written1;
          let newWritten2 = written2;

          // Only share if both papers passed and any paper has > 80
          if (
            written1 >= W_PASS &&
            mcq1 >= M_PASS &&
            written2 >= W_PASS &&
            mcq2 >= M_PASS
          ) {
            const total1 = written1 + mcq1;
            const total2 = written2 + mcq2;

            if (total1 > 80 && total2 < 80) {
              const excess = total1 - 80;
              const needed = 80 - total2;
              const transfer = Math.min(excess, needed);
              newWritten1 -= transfer;
              newWritten2 += transfer;
            } else if (total2 > 80 && total1 < 80) {
              const excess = total2 - 80;
              const needed = 80 - total1;
              const transfer = Math.min(excess, needed);
              newWritten2 -= transfer;
              newWritten1 += transfer;
            }
          }

          // Evaluate using shared marks
          const result1 = evaluateSubject({
            written1: newWritten1,
            mcq1,
            W_PASS,
            M_PASS,
          });

          const result2 = evaluateSubject({
            written1: newWritten2,
            mcq1: mcq2,
            W_PASS,
            M_PASS,
          });

          if (result1.gp === 0 || result2.gp === 0) failed = true;

          updatedSubjects.push({
            subject: papers[0].subject,
            marks: papers[0].marks,
            grade: result1.grade,
            point: result1.gp,
            comments: papers[0].comments || "",
          });
          updatedSubjects.push({
            subject: papers[1].subject,
            marks: papers[1].marks,
            grade: result2.grade,
            point: result2.gp,
            comments: papers[1].comments || "",
          });
        }
      } else {
        // Single-paper subject → normal evaluation
        const paper = papers[0];
        const written = paper?.marks?.written?.score || 0;
        const mcq = paper?.marks?.mcq?.score || 0;

        const W_PASS = Math.ceil((paper?.marks?.written?.outOf || 0) * 0.33);
        const M_PASS = Math.ceil((paper?.marks?.mcq?.outOf || 0) * 0.33);

        const { grade, gp } = evaluateSubject({
          written1: written,
          mcq1: mcq,
          W_PASS,
          M_PASS,
        });

        if (gp === 0) failed = true;

        updatedSubjects.push({
          subject: paper.subject,
          marks: paper.marks,
          grade,
          point: gp,
          comments: paper.comments || "",
        });
      }
    }

    // ✅ GPA calculation only from grouped subjects
    const { gpa: computedGPA, anyFail } = computeFinalGPA(updatedSubjects);
    const finalFailed = failed || anyFail;
    const gpa = finalFailed ? 0.0 : computedGPA;
    const overallGrade = finalFailed ? "F" : getOverallGradeFromGPA(gpa);

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
    console.error("Create Result Error:", error);
    res.status(500).json({ message: "Failed to create result", error });
  }
};

// GET ALL RESULTS
export const getResults = async (_req: Request, res: Response) => {
  try {
    const results = await Result.find().populate("student");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch results", error });
  }
};

// GET RESULTS BY STUDENT ID
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

// UPDATE RESULT
export const updateResult = async (req: Request, res: Response) => {
  try {
    const { id: resultId } = req.params;

    const { student, semester, year, subjects } = req.body as {
      student?: string;
      semester?: "FirstSemester" | "MidTerm" | "Annual";
      year?: number | string;
      subjects?: AnySubject[];
    };

    // Fetch existing result
    const existing = await Result.findById(resultId);
    if (!existing) {
      return res.status(404).json({ message: "Result not found" });
    }

    let failed = false;
    const updatedSubjects: any[] = [];

    // Group subjects by base name
    const subjectGroups: Record<string, AnySubject[]> = {};
    (subjects || existing.subjects).forEach((sub) => {
      const baseName = sub.subject
        .replace(/First Paper|Second Paper/gi, "")
        .trim();
      if (!subjectGroups[baseName]) subjectGroups[baseName] = [];
      subjectGroups[baseName].push(sub);
    });

    for (const base in subjectGroups) {
      const papers = subjectGroups[base];

      if (papers.length === 2) {
        // Extract marks
        let written1 = papers[0]?.marks?.written?.score || 0;
        let mcq1 = papers[0]?.marks?.mcq?.score || 0;
        let written2 = papers[1]?.marks?.written?.score || 0;
        let mcq2 = papers[1]?.marks?.mcq?.score || 0;

        const W_PASS = Math.ceil(
          (papers[0]?.marks?.written?.outOf || 0) * 0.33
        );
        const M_PASS = Math.ceil((papers[0]?.marks?.mcq?.outOf || 0) * 0.33);

        // Pass check first
        const failFirst = written1 < W_PASS || mcq1 < M_PASS;
        const failSecond = written2 < W_PASS || mcq2 < M_PASS;

        if (failFirst || failSecond) {
          updatedSubjects.push(
            ...papers.map((paper) => ({
              subject: paper.subject,
              marks: paper.marks,
              grade: "F",
              point: 0,
              comments: paper.comments || "",
            }))
          );
          failed = true;
        } else {
          // Both passed → apply mark sharing
          let newWritten1 = written1;
          let newWritten2 = written2;

          if (
            written1 >= W_PASS &&
            mcq1 >= M_PASS &&
            written2 >= W_PASS &&
            mcq2 >= M_PASS
          ) {
            const total1 = written1 + mcq1;
            const total2 = written2 + mcq2;

            if (total1 > 80 && total2 < 80) {
              const excess = total1 - 80;
              const needed = 80 - total2;
              const transfer = Math.min(excess, needed);
              newWritten1 -= transfer;
              newWritten2 += transfer;
            } else if (total2 > 80 && total1 < 80) {
              const excess = total2 - 80;
              const needed = 80 - total1;
              const transfer = Math.min(excess, needed);
              newWritten2 -= transfer;
              newWritten1 += transfer;
            }
          }

          // Evaluate using shared marks
          const result1 = evaluateSubject({
            written1: newWritten1,
            mcq1,
            W_PASS,
            M_PASS,
          });

          const result2 = evaluateSubject({
            written1: newWritten2,
            mcq1: mcq2,
            W_PASS,
            M_PASS,
          });

          if (result1.gp === 0 || result2.gp === 0) failed = true;

          updatedSubjects.push({
            subject: papers[0].subject,
            marks: papers[0].marks,
            grade: result1.grade,
            point: result1.gp,
            comments: papers[0].comments || "",
          });
          updatedSubjects.push({
            subject: papers[1].subject,
            marks: papers[1].marks,
            grade: result2.grade,
            point: result2.gp,
            comments: papers[1].comments || "",
          });
        }
      } else {
        // Single-paper subject → normal evaluation
        const paper = papers[0];
        const written = paper?.marks?.written?.score || 0;
        const mcq = paper?.marks?.mcq?.score || 0;

        const W_PASS = Math.ceil((paper?.marks?.written?.outOf || 0) * 0.33);
        const M_PASS = Math.ceil((paper?.marks?.mcq?.outOf || 0) * 0.33);

        const { grade, gp } = evaluateSubject({
          written1: written,
          mcq1: mcq,
          W_PASS,
          M_PASS,
        });

        if (gp === 0) failed = true;

        updatedSubjects.push({
          subject: paper.subject,
          marks: paper.marks,
          grade,
          point: gp,
          comments: paper.comments || "",
        });
      }
    }

    // ✅ GPA calculation
    const { gpa: computedGPA, anyFail } = computeFinalGPA(updatedSubjects);
    const finalFailed = failed || anyFail;
    const gpa = finalFailed ? 0.0 : computedGPA;
    const overallGrade = finalFailed ? "F" : getOverallGradeFromGPA(gpa);

    // Update in DB
    if (student) {
      // Convert to ObjectId if it's a string
      const mongoose = require("mongoose");
      existing.student =
        typeof student === "string"
          ? new mongoose.Types.ObjectId(student)
          : student;
    }
    existing.semester = semester || existing.semester;
    existing.year = year !== undefined ? Number(year) : existing.year;
    existing.subjects = updatedSubjects;
    existing.gpa = gpa;
    existing.overallGrade = overallGrade;

    await existing.save();

    return res
      .status(200)
      .json({ message: "Result updated", result: existing });
  } catch (error) {
    console.error("Update Result Error:", error);
    res.status(500).json({ message: "Failed to update result", error });
  }
};

// DELETE RESULT
export const deleteResult = async (req: Request, res: Response) => {
  try {
    const resultId = req.params.id;
    await Result.findByIdAndDelete(resultId);
    res.json({ message: "Result deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete result", error });
  }
};

// GET RESULT BY STUDENT INFO
export const getResultByStudentInfo = async (req: Request, res: Response) => {
  try {
    const { class: studentClass, session, rollNumber, semester } = req.body;

    const student = await Student.findOne({
      class: studentClass,
      session,
      rollNumber,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const results = await Result.find({
      student: student._id,
      semester,
    }).populate("student");

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No result found for this student" });
    }

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Fetch Result Error:", error);
    return res.status(500).json({ message: "Failed to fetch result", error });
  }
};

// GET ALL RESULTS BY CLASS, SESSION & SEMESTER, SORTED BY GPA DESC
export const getResultsByClassSessionSemester = async (
  req: Request,
  res: Response
) => {
  try {
    const { class: studentClass, session, semester } = req.body;

    if (!studentClass || !session || !semester) {
      return res
        .status(400)
        .json({ message: "Class, session, and semester are required" });
    }

    // Step 1: Find students in the given class and session
    const students = await Student.find({ class: studentClass, session });

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for this class and session" });
    }

    const studentIds = students.map((s) => s._id);

    // Step 2: Find results for these students and semester
    let results = await Result.find({
      student: { $in: studentIds },
      semester,
    }).populate("student");

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: "No results found for these students in the given semester",
      });
    }

    // Step 3: Sort results by GPA descending
    results = results.sort((a, b) => b.gpa - a.gpa);

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Fetch Results By Class, Session & Semester Error:", error);
    return res.status(500).json({ message: "Failed to fetch results", error });
  }
};
