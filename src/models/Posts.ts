import { model, Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: String,
    content: String,
    coverImage: String,
    author: { type: Schema.Types.ObjectId, ref: "User" },
    tags: [String],
  },
  { timestamps: true }
);

export const Post = model("Post", postSchema);
