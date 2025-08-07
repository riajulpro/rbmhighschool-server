import express from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  changePassword,
  updateUser,
  getAllUsers,
  getAllTeachers,
  deleteUser,
  updateUserWithEmail,
} from "../controllers/auth.controller";
import { authenticate, authorize } from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.get("/get-all-teachers", getAllTeachers);
router.get(
  "/get-all-users",
  authenticate,
  authorize("admin", "principal"),
  getAllUsers
);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", authenticate, changePassword);
router.put("/update/:id", authenticate, updateUser);
router.put("/update/email/:email", authenticate, updateUserWithEmail);
router.delete(
  "/remove/:id",
  authenticate,
  authorize("admin", "principal"),
  deleteUser
);

export default router;
