import { Schema, model } from "mongoose";

const institutionInfoSchema = new Schema(
  {
    name: String,
    establishedDate: String,
    firstAcknowledgementDate: String,
    recentAcknowledgementDate: String,
    mpoAssignmentDate: String,
    eiinNumber: String,
    schoolCode: String,
    mpoCode: String,
    boardCode: String,
    centreCode: String,
    stipendCode: String,
    logo: String,
    location: String,
    contactEmail: String,
    phone: String,
    about: String,
    shortInfo: String,
    fullAddress: String,
  },
  { timestamps: true }
);

export const InstitutionInfo = model("InstitutionInfo", institutionInfoSchema);
