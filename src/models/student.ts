import { Schema, model, Document } from "mongoose";

export interface IStudent extends Document {
  studentName: string;
  fatherName: string;
  motherName: string;
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
    studentName: String,
    fatherName: String,
    motherName: String,
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
