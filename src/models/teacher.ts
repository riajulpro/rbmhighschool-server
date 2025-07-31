import { Schema, model } from "mongoose";

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
  },
  { timestamps: true }
);

export const Teacher = model("Teacher", teacherSchema);
