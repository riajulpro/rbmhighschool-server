import { Schema, model } from "mongoose";

const skillSchema = new Schema({
  title: String,
  completionDate: Date,
  description: String,
  certificateUrl: String,
});

const teacherSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    designation: String,
    phone: String,
    institution: String,
    profileImg: String,
    specialization: [String],
    skills: [skillSchema],
    department: String,
    employeeId: String,
    joiningDate: Date,
  },
  { timestamps: true }
);

export const Teacher = model("Teacher", teacherSchema);
