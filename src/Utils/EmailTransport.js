import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Build transporter options from environment variables so it's configurable
const smtpHost = process.env.SMTP_HOST || null; // e.g. smtp.sendgrid.net or smtp.gmail.com
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : null; // e.g. 587
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_ADMIN;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

const defaultTimeout = process.env.SMTP_TIMEOUT ? Number(process.env.SMTP_TIMEOUT) : 30000; // 30s

let transporterOptions = {};
if (smtpHost && smtpPort && smtpUser && smtpPass) {
  transporterOptions = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for 587
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    pool: process.env.SMTP_POOL === 'true' || false,
    connectionTimeout: defaultTimeout,
    greetingTimeout: defaultTimeout,
    socketTimeout: defaultTimeout,
  };
} else {
  // Fallback to service if explicit SMTP not provided (may fail on some hosts like Render)
  transporterOptions = {
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: defaultTimeout,
    greetingTimeout: defaultTimeout,
    socketTimeout: defaultTimeout,
  };
}

const transporter = nodemailer.createTransport(transporterOptions);

export const sendOtpEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: smtpUser,
      to: email,
      subject: "Verify Your schoolemy Account",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd;">
          <h2>Hello, ${email}</h2>
          <p>To continue setting up your schoolemy account, please verify your account with the code below:</p>
          <h1 style="font-size: 48px; margin: 20px 0; color: #333;">${otp}</h1>
          <p style="color: #777;">This code will expire in 2 minutes. Please do not disclose this code to others.</p>
          <p style="color: #777;">If you did not make this request, please disregard this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #999;">© 2025 Schoolemy. All Rights Reserved.</p>
        </div>
      `,
    });
    return { success: true, message: "OTP sent to Email successfully" };
  } catch (error) {
    console.error("Error sending OTP email:", error);

    // In development, allow a controlled fallback so frontend can continue while SMTP is unreachable.
    // Enable by setting DEV_EMAIL_FALLBACK=true in .env (ONLY for local/dev testing).
    if (process.env.DEV_EMAIL_FALLBACK === 'true' && process.env.NODE_ENV !== 'production') {
      console.warn("DEV_EMAIL_FALLBACK enabled - returning OTP in response for testing.");
      return { success: true, message: "DEV fallback: OTP not delivered via SMTP", otp, warning: error.message };
    }

    return { success: false, message: "Error sending OTP email.", error: error.message };
  }
};

export default transporter;
