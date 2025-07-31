import { Schema, model, Document } from "mongoose";

export interface IClassRoutine extends Document {
  class: string;
  section: string;
  day: string; // e.g., "Sunday", "Monday"
  subject: string;
  teacher: string;
  startTime: string; // "10:00 AM"
  endTime: string; // "11:00 AM"
  room?: string;
}

const classRoutineSchema = new Schema<IClassRoutine>(
  {
    class: { type: String, required: true },
    section: { type: String, required: true },
    day: { type: String, required: true },
    subject: { type: String, required: true },
    teacher: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String },
  },
  { timestamps: true }
);

export const ClassRoutine = model<IClassRoutine>(
  "ClassRoutine",
  classRoutineSchema
);
