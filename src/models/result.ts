import { Schema, model, Document, Types } from "mongoose";

export interface ISubjectResult {
  subject: string;
  marks: number;
  comments?: string;
}

export interface IResult extends Document {
  student: Types.ObjectId;
  semester: "FirstSemester" | "MidTerm" | "Annual";
  year: number;
  subjects: ISubjectResult[];
  overallGrade?: string;
}

const subjectResultSchema = new Schema<ISubjectResult>({
  subject: String,
  marks: Number,
  comments: String,
});

const resultSchema = new Schema<IResult>(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    semester: {
      type: String,
      enum: ["FirstSemester", "MidTerm", "Annual"],
      required: true,
    },
    year: { type: Number, required: true },
    subjects: [subjectResultSchema],
    overallGrade: String,
  },
  { timestamps: true }
);

export const Result = model<IResult>("Result", resultSchema);
