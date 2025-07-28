import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  changePassword,
  updateUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", changePassword);
router.put("/update/:id", updateUser);

export default router;
