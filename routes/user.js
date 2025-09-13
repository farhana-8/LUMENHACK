const express = require('express');
const router = express.Router();
const User = require('../models/User');

// User Register
router.post('/register', async (req, res) => {
  console.log("Request Body:", req.body);
  const { username, email, password } = req.body;
  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ success: false, msg: "User already exists" });

    const user = await User.create({ username, email, password });
    res.json({ success: true, user });
  } catch (err) {
    console.error("User Signup Error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, msg: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ success: false, msg: "Invalid credentials" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("User Login Error:", err.message);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
