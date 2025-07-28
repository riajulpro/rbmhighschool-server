"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.changePassword = exports.verifyOtp = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendOtp_1 = require("../utils/sendOtp");
const user_1 = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield user_1.User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        return res.status(201).json({ message: "User registered", user });
    }
    catch (err) {
        return res.status(500).json({ message: "Registration failed", error: err });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.json({ message: "Login successful", token, user });
    }
    catch (err) {
        return res.status(500).json({ message: "Login failed", error: err });
    }
});
exports.login = login;
const otpStore = {}; // { email: otp }
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = otp;
        yield (0, sendOtp_1.sendOtpToEmail)(email, otp); // mock function
        return res.json({ message: "OTP sent to email" });
    }
    catch (err) {
        return res.status(500).json({ message: "Error sending OTP", error: err });
    }
});
exports.forgotPassword = forgotPassword;
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] === otp) {
        delete otpStore[email];
        return res.json({ message: "OTP verified" });
    }
    else {
        return res.status(400).json({ message: "Invalid OTP" });
    }
};
exports.verifyOtp = verifyOtp;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        return res.json({ message: "Password changed successfully" });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Error changing password", error: err });
    }
});
exports.changePassword = changePassword;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const user = yield user_1.User.findByIdAndUpdate(userId, updates, { new: true });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.json({ message: "User updated", user });
    }
    catch (err) {
        return res.status(500).json({ message: "Update failed", error: err });
    }
});
exports.updateUser = updateUser;
