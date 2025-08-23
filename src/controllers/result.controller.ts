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

// // CREATE RESULT
// export const createResult = async (req: Request, res: Response) => {
//   try {
//     const { student, semester, year, subjects } = req.body as {
//       student: string;
//       semester: "FirstSemester" | "MidTerm" | "Annual";
//       year: number | string;
//       subjects: AnySubject[];
//     };

//     let totalPoints = 0;
//     let failed = false;

//     const updatedSubjects = subjects.map((sub) => {
//       const { doc, gp } = evaluateOneSubject(sub);
//       if (gp === 0) failed = true;
//       totalPoints += gp;
//       return doc;
//     });

//     const gpa = failed
//       ? 0.0
//       : parseFloat((totalPoints / updatedSubjects.length).toFixed(2));
//     const overallGrade = failed ? "F" : getOverallGradeFromGPA(gpa);

//     const result = await Result.create({
//       student,
//       semester,
//       year,
//       subjects: updatedSubjects,
//       gpa,
//       overallGrade,
//     });

//     return res.status(201).json({ message: "Result created", result });
//   } catch (error) {
//     console.error("Create Result Error:", error);
//     res.status(500).json({ message: "Failed to create result", error });
//   }
// };

// CREATE RESULT
export const createResult = async (req: Request, res: Response) => {
  try {
    const { student, semester, year, subjects } = req.body as {
      student: string;
      semester: "FirstSemester" | "MidTerm" | "Annual";
      year: number | string;
      subjects: AnySubject[];
    };

    let totalPoints = 0;
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
        // Two-part subject → apply score sharing
        const written1 = papers[0]?.marks?.written?.score || 0;
        const mcq1 = papers[0]?.marks?.mcq?.score || 0;
        const written2 = papers[1]?.marks?.written?.score;
        const mcq2 = papers[1]?.marks?.mcq?.score;

        const W_PASS = Math.ceil(
          (papers[0]?.marks?.written?.outOf || 0) * 0.33
        );
        const M_PASS = Math.ceil((papers[0]?.marks?.mcq?.outOf || 0) * 0.33);

        const { total, grade, gp } = evaluateSubject({
          written1,
          mcq1,
          written2,
          mcq2,
          W_PASS,
          M_PASS,
        });

        if (gp === 0) failed = true;
        totalPoints += gp;

        const doc = papers.map((paper) => ({
          subject: paper.subject,
          marks: paper.marks,
          grade,
          point: gp,
          comments: paper.comments || "",
        }));

        updatedSubjects.push(...doc);
      } else {
        // Single-paper subject → normal evaluation
        const paper = papers[0];
        const written = paper?.marks?.written?.score || 0;
        const mcq = paper?.marks?.mcq?.score || 0;

        const W_PASS = Math.ceil((paper?.marks?.written?.outOf || 0) * 0.33);
        const M_PASS = Math.ceil((paper?.marks?.mcq?.outOf || 0) * 0.33);

        const { grade, gp, total } = evaluateSubject({
          written1: written,
          mcq1: mcq,
          W_PASS,
          M_PASS,
        } as any);

        if (gp === 0) failed = true;
        totalPoints += gp;

        updatedSubjects.push({
          subject: paper.subject,
          marks: paper.marks,
          grade,
          point: gp,
          comments: paper.comments || "",
        });
      }
    }

    const gpa = failed
      ? 0.0
      : parseFloat(
          (totalPoints / Object.keys(subjectGroups).length).toFixed(2)
        );
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
    const resultId = req.params.id;
    const {
      student,
      semester,
      year,
      subjects: incomingSubjects = [],
    } = req.body as {
      student?: string;
      semester?: "FirstSemester" | "MidTerm" | "Annual";
      year?: number | string;
      subjects?: AnySubject[];
    };

    const existingResult = await Result.findById(resultId);
    if (!existingResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    const incomingMap = new Map(
      (incomingSubjects as AnySubject[]).map((s) => [
        s.subject.toLowerCase(),
        s,
      ])
    );

    let totalPoints = 0;
    let failed = false;

    // Update existing subjects with incoming (if present)
    const updatedSubjects = existingResult.subjects.map(
      (existingSub: AnySubject) => {
        const key = existingSub.subject.toLowerCase();
        const source = incomingMap.get(key) ?? existingSub; // prefer incoming if provided
        // Ensure we carry over subject name if incoming missed it
        source.subject = existingSub.subject;

        const { doc, gp } = evaluateOneSubject(source);
        if (gp === 0) failed = true;
        totalPoints += gp;
        return doc;
      }
    );

    // Add any new subjects not previously present
    for (const incomingSub of incomingSubjects as AnySubject[]) {
      const exists = updatedSubjects.some(
        (s: AnySubject) =>
          s.subject.toLowerCase() === incomingSub.subject.toLowerCase()
      );
      if (!exists) {
        const { doc, gp } = evaluateOneSubject(incomingSub);
        if (gp === 0) failed = true;
        totalPoints += gp;
        updatedSubjects.push(doc);
      }
    }

    const gpa = failed
      ? 0.0
      : parseFloat((totalPoints / updatedSubjects.length).toFixed(2));
    const overallGrade = failed ? "F" : getOverallGradeFromGPA(gpa);

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

    return res.json({
      message: "Result updated successfully",
      result: updated,
    });
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
