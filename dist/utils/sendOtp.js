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
exports.sendOtpToEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL;
const transporter = nodemailer_1.default.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for 587
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});
const sendOtpToEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: fromEmail,
        to: email,
        subject: "🔐 Your OTP for Password Reset",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>School Management System</h2>
        <p>Hi there!</p>
        <p>Your OTP for password reset is:</p>
        <h1 style="color: #2c3e50;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <br />
        <p>Thank you,<br/>School Admin</p>
      </div>
    `,
    };
    try {
        yield transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}`);
    }
    catch (error) {
        console.error("❌ Failed to send email:", error);
        throw new Error("Failed to send OTP");
    }
});
exports.sendOtpToEmail = sendOtpToEmail;
