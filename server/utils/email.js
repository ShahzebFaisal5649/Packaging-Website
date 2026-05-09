const nodemailer = require('nodemailer');
const dns = require('dns');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let isVerified = false;
let verifyAttempts = 0;

// Verify connection at startup (max 3 retries, non-blocking)
const verifyTransporter = () => {
  if (verifyAttempts >= 3) {
    console.warn('[SERVER] ⚠️  Email verify gave up after 3 attempts — emails will still try to send via IPv4 lookup.');
    return;
  }
  verifyAttempts++;
  transporter.verify(function (error) {
    if (error) {
      console.error(`[SERVER] ❌ Email transporter error (attempt ${verifyAttempts}):`, error.message);
      if (['ECONNRESET', 'ETIMEDOUT', 'ENETUNREACH', 'ESOCKET'].includes(error.code)) {
        setTimeout(verifyTransporter, 15000);
      }
    } else {
      isVerified = true;
      console.log('[SERVER] ✅ Email server ready (Port:', process.env.EMAIL_PORT || 465, ', IPv4)');
    }
  });
};
verifyTransporter();

const sendEmail = async (options) => {
  const mailOptions = {
    from: `"Design Custom Box" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    if (!isVerified) {
      console.warn("[SERVER] ⚠️ Email transporter is not fully verified yet, attempting to send anyway...");
    }
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    // Don't crash if it fails, just return null or throw depending on usage
    return null;
  }
};

module.exports = sendEmail;
