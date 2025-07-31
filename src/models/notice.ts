import { Schema, model, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  description: string;
  date: Date;
  audience?: string;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    audience: {
      type: String,
      enum: ["students", "teachers", "all"],
      default: "all",
    },
  },
  { timestamps: true }
);

export const Notice = model<INotice>("Notice", noticeSchema);
