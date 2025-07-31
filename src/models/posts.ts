import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  coverImage?: string;
  authorId?: Types.ObjectId;
  tags?: string[];
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: String,
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    tags: [String],
  },
  { timestamps: true }
);

export const Post = model<IPost>("Post", postSchema);
