const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  refreshToken: String,
  device: String,
  expiresAt: Date
});

module.exports = mongoose.model("Session", sessionSchema);
