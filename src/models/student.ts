import { Schema, model, Document, Types } from "mongoose";

export interface IStudent extends Document {
  userId: Types.ObjectId;
  studentName: string;
  class: string;
  session: string;
  section: string;
  rollNumber: string;
  gender: string;
  dob: Date;
  guardianName: string;
  guardianPhone: string;
  address: string;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    studentName: String,
    class: String,
    section: String,
    session: String,
    rollNumber: String,
    gender: String,
    dob: Date,
    guardianName: String,
    guardianPhone: String,
    address: String,
  },
  { timestamps: true }
);

export const Student = model<IStudent>("Student", studentSchema);
