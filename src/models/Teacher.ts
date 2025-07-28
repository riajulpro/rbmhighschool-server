import { Schema, model } from "mongoose";

const teacherSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    department: String,
    designation: String,
    phone: String,
    photo: String,
    qualification: String,
  },
  { timestamps: true }
);

export const Teacher = model("Teacher", teacherSchema);
