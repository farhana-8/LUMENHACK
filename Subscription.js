const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: String, enum: ["free", "basic", "premium", "student"], default: "free" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
