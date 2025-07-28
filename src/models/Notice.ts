import { model, Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    title: String,
    content: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    forRoles: [String], // ['student', 'teacher']
  },
  { timestamps: true }
);

export const Notice = model("Notice", noticeSchema);
