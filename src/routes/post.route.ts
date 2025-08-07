import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "principal", "teacher"),
  createPost
);
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  updatePost
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal", "teacher"),
  deletePost
);

export default router;
