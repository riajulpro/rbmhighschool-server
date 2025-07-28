import { Schema, model } from "mongoose";

const institutionInfoSchema = new Schema(
  {
    name: String,
    establishedYear: Number,
    location: String,
    contactEmail: String,
    phone: String,
    about: String,
  },
  { timestamps: true }
);

export const InstitutionInfo = model("InstitutionInfo", institutionInfoSchema);
