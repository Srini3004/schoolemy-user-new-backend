import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * ================================
 * SendGrid SMTP Transporter
 * ================================
 */
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,               // ✅ Stable & recommended
  secure: false,
  auth: {
    user: "apikey",        // ✅ MUST be exactly 'apikey'
    pass: process.env.SENDGRID_API_KEY,
  },
});

/**
 * ================================
 * Verify SMTP Connection
 * ================================
 */
transporter.verify()
  .then(() => {
    console.log("✅ SendGrid SMTP connected successfully");
  })
  .catch((err) => {
    console.error("❌ SendGrid SMTP verification failed:", err.message);
  });

/**
 * ================================
 * OTP Email Template
 * ================================
 */
const buildOtpHtml = (email, otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eaeaea;">
    <h2 style="text-align: center;">Verify Your Schoolemy Account</h2>
    <p>Hello <strong>${email}</strong>,</p>
    <p>Please use the OTP below to verify your account:</p>
    <h1 style="text-align: center; letter-spacing: 4px;">${otp}</h1>
    <p>This OTP is valid for <strong>2 minutes</strong>.</p>
    <p style="color: #888;">If you did not request this, please ignore this email.</p>
    <hr />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      © 2025 Schoolemy. All rights reserved.
    </p>
  </div>
`;

/**
 * ================================
 * Send OTP Email Function
 * ================================
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    // 🔒 Safety checks
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is missing");
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM is missing (must be verified in SendGrid)");
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,   // ✅ VERIFIED SENDER ONLY
      to: email,
      subject: "Your OTP Code - Schoolemy",
      html: buildOtpHtml(email, otp),
    });

    console.log(`✅ OTP email sent to ${email}`);
    console.log("SendGrid response:", info);
    return { success: true, message: "OTP sent successfully", info };

  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    return { success: false, message: "Failed to send OTP", error: error.message, fullError: error };
  }
};

export default transporter;
