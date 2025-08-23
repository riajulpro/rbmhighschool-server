import { Schema, model, Document } from "mongoose";

export interface IExamResult extends Document {
  year: string;
  exam: string;
  totalExaminee: number;
  totalPassed: number;
  totalFailed: number;
  totalPassPercentage: number;
  totalFailPercentage: number;
  totalPassMale: number;
  totalPassFemale: number;
  totalAPlus: number;
  totalAGrade: number;
  totalAMinus: number;
  totalB: number;
  totalC: number;
  totalD: number;
}

const ExamResultSchema = new Schema<IExamResult>(
  {
    year: { type: String, required: true },
    exam: { type: String, required: true },
    totalExaminee: { type: Number, required: true, default: 0 },
    totalPassed: { type: Number, required: true, default: 0 },
    totalFailed: { type: Number, required: true, default: 0 },
    totalPassPercentage: { type: Number, default: 0 },
    totalFailPercentage: { type: Number, default: 0 },
    totalPassMale: { type: Number, required: true, default: 0 },
    totalPassFemale: { type: Number, required: true, default: 0 },
    totalAPlus: { type: Number, required: true, default: 0 },
    totalAGrade: { type: Number, required: true, default: 0 },
    totalAMinus: { type: Number, required: true, default: 0 },
    totalB: { type: Number, required: true, default: 0 },
    totalC: { type: Number, required: true, default: 0 },
    totalD: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const ExamResult = model<IExamResult>("ExamResult", ExamResultSchema);
