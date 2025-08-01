import { Schema, model, Document } from "mongoose";

export interface INotice extends Document {
  title: string;
  docPath: string;
  audience?: string;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    docPath: { type: String, required: true },
    audience: {
      type: String,
      enum: ["students", "teachers", "all"],
      default: "all",
    },
  },
  { timestamps: true }
);

export const Notice = model<INotice>("Notice", noticeSchema);
