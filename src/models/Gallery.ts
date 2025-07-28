import { Schema, model } from "mongoose";

const gallerySchema = new Schema(
  {
    title: String,
    description: String,
    mediaUrls: [String],
    type: { type: String, enum: ["video", "photo"], required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Gallery = model("Gallery", gallerySchema);
