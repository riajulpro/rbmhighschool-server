import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post("/", authenticate, authorize("admin", "principal"), createNotice);
router.get("/", getAllNotices);
router.get("/:id", getNoticeById);
router.put("/:id", authenticate, authorize("admin", "principal"), updateNotice);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteNotice
);

export default router;
