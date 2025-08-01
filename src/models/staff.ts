import { Schema, model } from "mongoose";

const staffSchema = new Schema(
  {
    name: String,
    responsibility: String,
    profilePic: String,
  },
  { timestamps: true }
);

export const Staff = model("Staff", staffSchema);
