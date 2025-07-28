import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ success: true, message: "✅ Server is running!" });
});

export default router;
