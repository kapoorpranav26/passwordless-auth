const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (email, otp) => {
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 10;

  await transporter.sendMail({
    from: `"Secure Auth" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp}. It will expire in ${expiryMinutes} minutes.`,
    html: `
      <h2>Passwordless Login</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in <strong>${expiryMinutes} minutes</strong>.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
  });
};
