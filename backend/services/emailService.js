const nodemailer = require("nodemailer");
const { email, password } = require("../config/email");

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: password,
  },
});

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendOTP = async (toEmail, otp) => {
  try {
    // Validate email format
    if (!emailRegex.test(toEmail)) {
      console.error("Invalid email format:", toEmail);
      return false;
    }

    // Email options
    const mailOptions = {
      from: email,
      to: toEmail,
      subject: "Trade Hub - Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4a90e2; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    };

    // Verify SMTP connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

module.exports = { sendOTP };
