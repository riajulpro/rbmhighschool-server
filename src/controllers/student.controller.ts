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

    const students = await Student.find(filter);
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

export const getStudentGenderStatsByClass = async (
  _: Request,
  res: Response
) => {
  try {
    const classWiseStats = await Student.aggregate([
      {
        $group: {
          _id: {
            class: "$class",
            gender: "$gender",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.class",
          counts: {
            $push: {
              gender: "$_id.gender",
              count: "$count",
            },
          },
          total: { $sum: "$count" },
        },
      },
      {
        $project: {
          _id: 0,
          class: "$_id",
          male: {
            $let: {
              vars: {
                maleObj: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$counts",
                        as: "item",
                        cond: { $eq: ["$$item.gender", "male"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$maleObj.count", 0] },
            },
          },
          female: {
            $let: {
              vars: {
                femaleObj: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$counts",
                        as: "item",
                        cond: { $eq: ["$$item.gender", "female"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: { $ifNull: ["$$femaleObj.count", 0] },
            },
          },
          total: "$total",
        },
      },
      {
        $sort: { class: 1 },
      },
    ]);

    // Calculate overall totals
    const totalMale = classWiseStats.reduce(
      (acc, curr) => acc + (curr.male || 0),
      0
    );
    const totalFemale = classWiseStats.reduce(
      (acc, curr) => acc + (curr.female || 0),
      0
    );
    const totalStudents = classWiseStats.reduce(
      (acc, curr) => acc + (curr.total || 0),
      0
    );

    const summary = {
      class: "All Classes",
      male: totalMale,
      female: totalFemale,
      total: totalStudents,
    };

    const resultWithSummary = [...classWiseStats, summary];

    res.status(200).json({ stats: resultWithSummary });
  } catch (error) {
    res.status(500).json({ message: "Failed to get student stats", error });
  }
};

// ✅ Get student IDs and names by class and session
export const getStudentNamesByClassAndSession = async (
  req: Request,
  res: Response
) => {
  try {
    const { session, class: className } = req.query;

    if (!session || !className) {
      return res
        .status(400)
        .json({ message: "Session and class are required" });
    }

    const students = await Student.find(
      { session, class: className },
      { _id: 1, name: 1 }
    );

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Failed to get student names", error });
  }
};
