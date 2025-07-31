import { Schema, model, Document } from "mongoose";

export interface IGallery extends Document {
  title: string;
  type: "photo" | "video";
  url: string;
  description?: string;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["photo", "video"], required: true },
    url: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

export const Gallery = model<IGallery>("Gallery", gallerySchema);
