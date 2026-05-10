const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Reusable email sender
 */
const sendEmail = async (options) => {
    try {
        const { email, subject, message, html } = options;

        const response = await resend.emails.send({
            from: "Design Custom Box <onboarding@resend.dev>",
            to: email,
            subject,
            html:
                html ||
                `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>${subject}</h2>
          <p>${message || ""}</p>
          <hr />
          <p style="font-size:12px;color:gray;">
            Design Custom Box Team
          </p>
        </div>
        `,
        });

        console.log("[EMAIL] ✅ Sent to:", email);
        return response;
    } catch (error) {
        console.error("[EMAIL] ❌ Failed:", error.message);
        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;