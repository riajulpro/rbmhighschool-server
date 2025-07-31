import { Request, Response } from "express";
import { Student } from "../models/student";
import { Result } from "../models/result";

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

export const getStudentCountsGrouped = async (req: Request, res: Response) => {
  try {
    const { session } = req.query;

    const matchStage: any = {};
    if (session) matchStage.session = session;

    const students = await Student.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            session: "$session",
            class: "$class",
            gender: "$gender",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const resultMap: Record<
      string,
      Record<string, { male: number; female: number; total: number }>
    > = {};

    students.forEach((entry) => {
      const session = entry._id.session;
      const className = entry._id.class;
      const gender = entry._id.gender;
      const count = entry.count;

      if (!resultMap[session]) {
        resultMap[session] = {};
      }

      if (!resultMap[session][className]) {
        resultMap[session][className] = { male: 0, female: 0, total: 0 };
      }

      if (gender === "male") resultMap[session][className].male += count;
      else if (gender === "female")
        resultMap[session][className].female += count;

      resultMap[session][className].total += count;
    });

    return res.status(200).json({
      message: session
        ? `Counts for session ${session}`
        : "Counts for all sessions",
      data: resultMap,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to get student counts", error });
  }
};

// promotion system
// export const promotePassedStudents = async (req: Request, res: Response) => {
//   try {
//     const { year, currentClass, newSession } = req.body;

//     if (!year || !currentClass || !newSession) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Step 1: Get passed results for the year and class
//     const passedResults = await Result.find({
//       year,
//       semester: "Annual",
//       overallGrade: { $ne: "F" },
//     }).populate("student");

//     if (passedResults.length === 0) {
//       return res.status(404).json({ message: "No passed students found" });
//     }

//     const promotedStudents = [];

//     for (const result of passedResults) {
//       const oldStudent = result.student;

//       // Skip if student isn't from the target class
//       if (!oldStudent || oldStudent.class !== currentClass) continue;

//       const newClass = (parseInt(oldStudent.class) + 1).toString();

//       const newStudent = await Student.create({
//         userId: oldStudent.userId,
//         class: newClass,
//         session: newSession,
//         section: oldStudent.section,
//         rollNumber: oldStudent.rollNumber, // You can reset roll number logic if needed
//         gender: oldStudent.gender,
//         dob: oldStudent.dob,
//         guardianName: oldStudent.guardianName,
//         guardianPhone: oldStudent.guardianPhone,
//         address: oldStudent.address,
//       });

//       promotedStudents.push(newStudent);
//     }

//     res.json({
//       message: `${promotedStudents.length} students promoted to class ${
//         parseInt(currentClass) + 1
//       } for session ${newSession}`,
//       promoted: promotedStudents,
//     });
//   } catch (error) {
//     console.error("Promotion error:", error);
//     res.status(500).json({ message: "Failed to promote students", error });
//   }
// };
