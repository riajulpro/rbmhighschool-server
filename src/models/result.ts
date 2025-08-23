import { Schema, model, Document, Types } from "mongoose";

export interface SubjectResult {
  subject: string;
  marks: {
    written: {
      score: number;
      outOf: number;
    };
    mcq?: {
      score: number;
      outOf: number;
    };
    total?: number;
  };
  grade?: string;
  point?: number;
  comments?: string;
}

export interface IResult extends Document {
  student: Types.ObjectId;
  semester: "FirstSemester" | "MidTerm" | "Annual";
  year: number;
  subjects: SubjectResult[];
  gpa: number;
  overallGrade: string;
}

const subjectSchema = new Schema<SubjectResult>({
  subject: String,
  marks: {
    written: {
      score: Number,
      outOf: { type: Number, default: 100 },
    },
    mcq: {
      score: Number,
      outOf: { type: Number, default: 0 },
    },
    total: {
      type: Number,
    },
  },
  grade: String,
  point: Number,
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
    year: Number,
    subjects: [subjectSchema],
    gpa: Number,
    overallGrade: String,
  },
  { timestamps: true }
);

export const Result = model<IResult>("Result", resultSchema);
