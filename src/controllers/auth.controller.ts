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

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  // Validate request body
  if (!email || !otp || !password) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and password are required" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      message: "Password must be a string with at least 6 characters",
    });
  }

  // Check OTP
  if (!otpStore[email]) {
    return res.status(400).json({ message: "No OTP found for this email" });
  }
  if (otpStore[email] !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password in database
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    user.password = hashedPassword;
    await user.save();

    delete otpStore[email]; // Remove used OTP

    return res.json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in verifyOtp:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare the old password with the stored hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password and update it
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

export const updateUserWithEmail = async (req: Request, res: Response) => {
  try {
    const { email, data } = req.body;

    const existedUser = await User.findOne({ email });

    if (!existedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findByIdAndUpdate(existedUser._id, data, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated successfully", user });
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

// POST /api/auth/refresh
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    // Verify refresh token (you should store it in DB or Redis to validate)
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;

    // Issue a new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({ token: newAccessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid refresh token", error: err });
  }
};
