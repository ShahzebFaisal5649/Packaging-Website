const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Reusable email sender using Nodemailer (SMTP)
 */
const sendEmail = async (options) => {
  try {
    const { email, subject, message, html } = options;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      family: 4,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Design Custom Box" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: html || `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>${subject}</h2>
          <p>${message || ""}</p>
          <hr />
          <p style="font-size:12px;color:gray;">
            Design Custom Box Team
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("[EMAIL] ✅ Sent to:", email, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[EMAIL] ❌ Failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;