import { Schema, model } from "mongoose";

const teacherSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    designation: String,
    name: String,
    phone: String,
    email: String,
    institution: String,
    profileImg: String,
    specialization: [String],
  },
  { timestamps: true }
);

export const Teacher = model("Teacher", teacherSchema);
