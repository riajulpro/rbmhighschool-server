import { Schema, model } from "mongoose";

const authoritySchema = new Schema(
  {
    name: String,
    role: String,
    photo: String,
    message: String,
  },
  { timestamps: true }
);

export const Authority = model("Authority", authoritySchema);
