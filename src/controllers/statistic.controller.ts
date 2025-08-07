import { Request, Response } from "express";
import { Staff } from "../models/staff";
import { Admission } from "../models/admission";
import { Student } from "../models/student";
import { Teacher } from "../models/teacher";
import { Post } from "../models/posts";
import { Gallery } from "../models/gallery";
import { HonoredStudent } from "../models/honoredStudent";
import { Result } from "../models/result";
import { User, UserRole } from "../models/user";

interface DashboardStats {
  totalStaff: number;
  totalAdmissions: number;
  totalStudents: number;
  studentGender: { male: number; female: number };
  totalTeachers: number;
  totalPosts: number;
  totalGalleryItems: { photos: number; videos: number };
  totalHonoredStudents: number;
  averageGPA: number;
  gradeDistribution: {
    APlus: number;
    A: number;
    AMinus: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  userRoles: {
    admin: number;
    principal: number;
    teacher: number;
    student: number;
  };
}

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Parallel queries for efficiency
    const [
      staffCount,
      admissionCount,
      studentCount,
      studentGender,
      teacherCount,
      postCount,
      galleryStats,
      honoredStudentCount,
      resultStats,
      gradeDistribution,
      userRoleStats,
    ] = await Promise.all([
      Staff.countDocuments(),
      Admission.countDocuments(),
      Student.countDocuments(),
      Student.aggregate([
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            gender: "$_id",
            count: 1,
          },
        },
      ]),
      Teacher.countDocuments(),
      Post.countDocuments(),
      Gallery.aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            type: "$_id",
            count: 1,
          },
        },
      ]),
      HonoredStudent.countDocuments(),
      Result.aggregate([
        {
          $group: {
            _id: null,
            avgGPA: { $avg: "$gpa" },
          },
        },
      ]),
      Result.aggregate([
        { $unwind: "$subjects" },
        {
          $group: {
            _id: "$subjects.grade",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            grade: "$_id",
            count: 1,
          },
        },
      ]),
      User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            role: "$_id",
            count: 1,
          },
        },
      ]),
    ]);

    // Format gallery stats
    const galleryItems = {
      photos: galleryStats.find((g) => g.type === "photo")?.count || 0,
      videos: galleryStats.find((g) => g.type === "video")?.count || 0,
    };

    // Format student gender stats
    const studentGenderStats = {
      male:
        studentGender.find((g) => g.gender?.toLowerCase() === "male")?.count ||
        0,
      female:
        studentGender.find((g) => g.gender?.toLowerCase() === "female")
          ?.count || 0,
    };

    // Format grade distribution
    const grades = {
      APlus: "A+",
      A: "A",
      AMinus: "A-",
      B: "B",
      C: "C",
      D: "D",
      F: "F",
    };
    const gradeDistributionStats = {
      APlus:
        gradeDistribution.find((g) => g.grade === grades.APlus)?.count || 0,
      A: gradeDistribution.find((g) => g.grade === grades.A)?.count || 0,
      AMinus:
        gradeDistribution.find((g) => g.grade === grades.AMinus)?.count || 0,
      B: gradeDistribution.find((g) => g.grade === grades.B)?.count || 0,
      C: gradeDistribution.find((g) => g.grade === grades.C)?.count || 0,
      D: gradeDistribution.find((g) => g.grade === grades.D)?.count || 0,
      F: gradeDistribution.find((g) => g.grade === grades.F)?.count || 0,
    };

    // Format user role stats
    const userRoles = {
      admin: userRoleStats.find((r) => r.role === UserRole.ADMIN)?.count || 0,
      principal:
        userRoleStats.find((r) => r.role === UserRole.PRINCIPAL)?.count || 0,
      teacher:
        userRoleStats.find((r) => r.role === UserRole.TEACHER)?.count || 0,
      student:
        userRoleStats.find((r) => r.role === UserRole.STUDENT)?.count || 0,
    };

    // Construct response
    const stats: DashboardStats = {
      totalStaff: staffCount,
      totalAdmissions: admissionCount,
      totalStudents: studentCount,
      studentGender: studentGenderStats,
      totalTeachers: teacherCount,
      totalPosts: postCount,
      totalGalleryItems: galleryItems,
      totalHonoredStudents: honoredStudentCount,
      averageGPA: resultStats[0]?.avgGPA || 0,
      gradeDistribution: gradeDistributionStats,
      userRoles,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
