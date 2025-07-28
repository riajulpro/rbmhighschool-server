import { Schema, model, Document } from "mongoose";

export enum UserRole {
  ADMIN = "admin",
  PRINCIPAL = "principal",
  TEACHER = "teacher",
  STUDENT = "student",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
