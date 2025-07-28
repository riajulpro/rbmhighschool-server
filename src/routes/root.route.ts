import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ success: true, message: "✅ Server is running!" });
});

export default router;
