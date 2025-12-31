const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  otpHash: String,
  expiresAt: Date,
  attempts: { type: Number, default: 0 }
});

module.exports = mongoose.model("OTP", otpSchema);
