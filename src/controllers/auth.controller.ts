import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpToEmail } from "../utils/sendOtp";
import { User } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({ message: "User registered", user });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ message: "Login successful", token, user });
  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err });
  }
};

const otpStore: Record<string, string> = {}; // { email: otp }

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    await sendOtpToEmail(email, otp); // mock function

    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    return res.status(500).json({ message: "Error sending OTP", error: err });
  }
};

export const verifyOtp = (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ message: "OTP verified" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error changing password", error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Update failed", error: err });
  }
};

// Delete
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords for security
    res.status(200).json({ message: "All users fetched", users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
};

export const getAllTeachers = async (_: Request, res: Response) => {
  try {
    const users = await User.find({
      role: "teacher",
    }).select("_id name");

    res.status(200).json({ message: "All teachers fetched", teachers: users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err });
  }
};
