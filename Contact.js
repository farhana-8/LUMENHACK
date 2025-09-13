// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional link to a user
  name: { type: String, required: true },
  emailId: { type: String, required: true },       // changed to emailId
  companyName: { type: String },                   // optional company field
  subject: { type: String, required: true },       // subject of the message
  message: { type: String, required: true },       // detailed message
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
