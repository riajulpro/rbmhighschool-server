import { Router } from "express";
import { getDashboardStats } from "../controllers/statistic.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// Get dashboard statistics
router.get("/", getDashboardStats);

export default router;
