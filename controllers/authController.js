const bcrypt = require("bcryptjs");
const User = require("../models/User");
const OTP = require("../models/OTP");
const Session = require("../models/Session");
const sendOTP = require("../utils/sendOTP");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/tokenService");

// ======================= SEND OTP =======================
exports.sendOtp = async (req, res) => {
  try {
    if (!req.body || !req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, devices: [] });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");

    await OTP.deleteMany({ userId: user._id });

    await OTP.create({
      userId: user._id,
      otpHash,
      expiresAt: new Date(Date.now() + expiryMinutes * 60 * 1000)
    });

    // Send OTP via email
    await sendOTP(email, otp);

    console.log("📩 OTP:", otp);

    return res.json({
      message: "OTP sent successfully",
      expiresInMinutes: expiryMinutes
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ======================= VERIFY OTP =======================
exports.verifyOtp = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.otp || !req.body.device) {
      return res.status(400).json({
        message: "Email, OTP and device are required"
      });
    }

    const { email, otp, device } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpRecord = await OTP.findOne({ userId: user._id });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteMany({ userId: user._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.devices.includes(device)) {
      user.devices.push(device);
      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Session.create({
      userId: user._id,
      refreshToken,
      device,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await OTP.deleteMany({ userId: user._id });

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
