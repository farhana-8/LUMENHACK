const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Admin Register
router.post('/register', async (req, res) => {
  console.log("Request Body:", req.body);
  const { name, email, password, phone, department } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ success: false, msg: "Admin already exists" });

    const admin = await Admin.create({ name, email, password, phone, department });
    res.json({ success: true, admin });
  } catch (err) {
    console.error("Admin Register Error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ success: false, msg: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ success: false, msg: "Invalid credentials" });

    res.json({ success: true, admin });
  } catch (err) {
    console.error("Admin Login Error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
