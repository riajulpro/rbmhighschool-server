import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const smtpHost = process.env.SMTP_HOST!;
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER!;
const smtpPass = process.env.SMTP_PASS!;
const fromEmail = process.env.FROM_EMAIL!;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for 587
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export const sendOtpToEmail = async (
  email: string,
  otp: string
): Promise<void> => {
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
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Failed to send OTP");
  }
};
