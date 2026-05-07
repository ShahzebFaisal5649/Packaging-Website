const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection at startup (non-blocking)
transporter.verify(function (error, success) {
  if (error) {
    console.error("[SERVER] ❌ Email transporter error:", error.message);
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      console.warn("[SERVER] 💡 Tip: If you are using Gmail, ensure your App Password is correct and port 587 is not blocked by your firewall.");
    }
  } else {
    console.log("[SERVER] ✅ Email server ready to send messages (Port:", process.env.EMAIL_PORT || 587, ")");
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: `"Design Custom Box" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};

module.exports = sendEmail;
