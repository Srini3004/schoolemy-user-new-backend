import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Gmail configuration using nodemailer
// Uses EMAIL_ADMIN and EMAIL_PASS from .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection on startup (non-blocking)
transporter.verify()
  .then(() => console.log("✅ Nodemailer ready to send emails via Gmail"))
  .catch((err) => console.error("❌ Nodemailer verify failed:", err.message));

// Utility to build HTML body
const buildHtml = (email, otp) => `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd;">
    <h2>Hello, ${email}</h2>
    <p>To continue setting up your schoolemy account, please verify your account with the code below:</p>
    <h1 style="font-size: 48px; margin: 20px 0; color: #333;">${otp}</h1>
    <p style="color: #777;">This code will expire in 2 minutes. Please do not disclose this code to others.</p>
    <p style="color: #777;">If you did not make this request, please disregard this email.</p>
    <hr style="margin: 20px 0;">
    <p style="color: #999;">© 2025 Schoolemy. All Rights Reserved.</p>
  </div>
`;

export const sendOtpEmail = async (email, otp) => {
  if (!process.env.EMAIL_ADMIN || !process.env.EMAIL_PASS) {
    console.error("EMAIL_ADMIN or EMAIL_PASS not set in environment");
    return { success: false, message: "Email credentials not configured" };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: email,
      subject: "Verify Your Schoolemy Account",
      html: buildHtml(email, otp),
    });

    console.log(`✅ OTP email sent to ${email}`);
    return { success: true, message: "OTP sent to Email successfully" };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.message);
    return { success: false, message: "Error sending OTP email", error: error.message };
  }
};

export default transporter;
