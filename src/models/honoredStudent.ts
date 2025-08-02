import { Schema, model, Document } from "mongoose";

export interface IHonoredStudent extends Document {
  name: string;
  year: string;
  reason: string;
  photo?: string;
}

const honoredStudentSchema = new Schema<IHonoredStudent>(
  {
    name: { type: String, required: true },
    year: { type: String, required: true },
    reason: { type: String, required: true },
    photo: { type: String }, // image url or filename
  },
  { timestamps: true }
);

export const HonoredStudent = model<IHonoredStudent>(
  "HonoredStudent",
  honoredStudentSchema
);
