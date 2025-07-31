import { Request, Response } from "express";
import { Post } from "../models/posts";

// Create
export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json({ message: "Post created", post });
  } catch (error) {
    res.status(500).json({ message: "Failed to create post", error });
  }
};

// Get All
export const getAllPosts = async (_: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error });
  }
};

// Get One
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error });
  }
};

// Update
export const updatePost = async (req: Request, res: Response) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post updated", post: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update post", error });
  }
};

// Delete
export const deletePost = async (req: Request, res: Response) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error });
  }
};
