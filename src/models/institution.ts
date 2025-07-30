import { Schema, model } from "mongoose";

const institutionInfoSchema = new Schema(
  {
    name: String,
    logo: String,
    establishedYear: Number,
    location: String,
    contactEmail: String,
    phone: String,
    about: String,
    shortInfo: String,
    eiinNumber: String,
    schoolCode: String,
    fullAddress: String,
  },
  { timestamps: true }
);

export const InstitutionInfo = model("InstitutionInfo", institutionInfoSchema);
