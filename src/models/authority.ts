import { Schema, model } from "mongoose";

const authoritySchema = new Schema(
  {
    name: String,
    responsibility: String,
    profilePic: String,
  },
  { timestamps: true }
);

export const Authority = model("Authority", authoritySchema);
