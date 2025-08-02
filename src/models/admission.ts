import { Schema, model, Document } from "mongoose";

export interface IAdmission extends Document {
  class: string;
  studentName: string;
  studentNameEnglish: string;
  academicYear: string;
  dateOfBirth: Date;
  fatherName: string;
  motherName: string;
  fatherOccupation?: string;
  address: string;
  mobileNumber: string;
  email?: string;
  photo?: string; // Image URL or filename
  previousInstitution?: string;
  previousInstitutionAddress?: string;
}

const admissionSchema = new Schema<IAdmission>(
  {
    class: { type: String, required: true },
    studentName: { type: String, required: true },
    studentNameEnglish: { type: String, required: true },
    academicYear: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    fatherOccupation: String,
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email: String,
    photo: String,
    previousInstitution: String,
    previousInstitutionAddress: String,
  },
  { timestamps: true }
);

export const Admission = model<IAdmission>("Admission", admissionSchema);
