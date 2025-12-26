import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Read configuration
const SMTP_HOST = process.env.SMTP_HOST || null;
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.EMAIL_ADMIN || process.env.EMAIL_FROM;
const SMTP_PASS = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const FROM_ADDRESS = process.env.EMAIL_FROM || SMTP_USER || "no-reply@yourdomain.com";
const DEFAULT_TIMEOUT = process.env.SMTP_TIMEOUT ? Number(process.env.SMTP_TIMEOUT) : 30000;
const MAX_RETRIES = process.env.SMTP_MAX_RETRIES ? Number(process.env.SMTP_MAX_RETRIES) : 3;

// Common ports to try when SMTP connection fails (ordered)
const COMMON_SMTP_PORTS = [587, 465, 25, 2525];

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

// Create a transporter for a given port and secure flag
const createTransporter = (host, port, secure) => {
  if (!host || !SMTP_USER || !SMTP_PASS) return null;
  const opts = {
    host,
    port,
    secure: !!secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: DEFAULT_TIMEOUT,
    greetingTimeout: DEFAULT_TIMEOUT,
    socketTimeout: DEFAULT_TIMEOUT,
    requireTLS: port === 587 || port === 25 || !secure,
    tls: {
      // allow self-signed certs if explicitly allowed
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false",
    },
  };
  return nodemailer.createTransport(opts);
};

// Try sending with retries and alternate port/secure combinations on recoverable errors
export const sendOtpEmail = async (email, otp) => {
  if (!SMTP_HOST) {
    if (process.env.DEV_EMAIL_FALLBACK === "true" && process.env.NODE_ENV !== "production") {
      console.warn("DEV_EMAIL_FALLBACK enabled - returning OTP in response for testing.");
      return { success: true, message: "DEV fallback: OTP returned for testing", otp };
    }
    return { success: false, message: "SMTP_HOST not configured" };
  }

  const portsToTry = process.env.SMTP_PORT ? [Number(process.env.SMTP_PORT)] : COMMON_SMTP_PORTS;

  let lastError = null;
  let attempt = 0;

  for (const port of portsToTry) {
    // for each port try both secure=true (465) and secure=false (587/others) where sensible
    const secureOptions = port === 465 ? [true] : [false, true];
    for (const secure of secureOptions) {
      attempt += 1;
      if (attempt > MAX_RETRIES) break;

      const transporter = createTransporter(SMTP_HOST, port, secure);
      if (!transporter) {
        lastError = new Error("Transporter not configured properly (missing credentials)");
        continue;
      }

      // verify to get early feedback on connection issues
      try {
        // eslint-disable-next-line no-await-in-loop
        await transporter.verify();
      } catch (err) {
        lastError = err;
        // If verify fails due to timeout/connection, continue to next option
        if (["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "ENOTFOUND"].includes(err && err.code)) {
          console.warn(`SMTP verify failed on ${SMTP_HOST}:${port} (secure=${secure}) — ${err.code} ${err.message}`);
          continue;
        }
        // Other errors — keep trying alternate configs
        console.warn(`SMTP verify warning on ${SMTP_HOST}:${port} (secure=${secure}) — ${err && err.message}`);
        continue;
      }

      // Try to send mail
      try {
        // eslint-disable-next-line no-await-in-loop
        await transporter.sendMail({
          from: FROM_ADDRESS,
          to: email,
          subject: "Verify Your schoolemy Account",
          html: buildHtml(email, otp),
        });
        return { success: true, message: `OTP sent via SMTP (${SMTP_HOST}:${port} secure=${secure})` };
      } catch (err) {
        lastError = err;
        console.error(`Error sending via SMTP ${SMTP_HOST}:${port} secure=${secure}:`, err && err.message ? err.message : err);
        // Retry on recoverable network errors
        if (["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "ENOTFOUND"].includes(err && err.code)) {
          console.warn(`Recoverable SMTP error (${err.code}). Trying next configuration.`);
          continue; // try next port/secure combination
        }

        // For authentication errors or other non-recoverable errors, stop further attempts
        if (["EAUTH", "EAUTH"].includes(err && err.code)) {
          return { success: false, message: "SMTP authentication failed", error: err && err.message };
        }
      }
    }
    if (attempt > MAX_RETRIES) break;
  }

  // If we reach here, all attempts failed
  if (process.env.DEV_EMAIL_FALLBACK === "true" && process.env.NODE_ENV !== "production") {
    console.warn("DEV_EMAIL_FALLBACK enabled - returning OTP in response for testing.");
    return { success: true, message: "DEV fallback: OTP returned for testing", otp, warning: lastError && lastError.message };
  }

  return { success: false, message: "All SMTP attempts failed", error: lastError && (lastError.message || lastError.code) };
};

export default null;
