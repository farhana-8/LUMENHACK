const express = require("express");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const router = express.Router();

// ----- Plan CRUD -----
router.post("/plans", async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.json({ message: "Plan created", plan });
  } catch (err) {
    res.status(500).json({ message: "Error creating plan", error: err.message });
  }
});

router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plans", error: err.message });
  }
});

router.put("/plans/:id", async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Plan updated", plan });
  } catch (err) {
    res.status(500).json({ message: "Error updating plan", error: err.message });
  }
});

router.delete("/plans/:id", async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting plan", error: err.message });
  }
});

// ----- User Management -----
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

// ----- Subscription Management -----
router.get("/subscriptions", async (req, res) => {
  try {
    const subs = await Subscription.find().populate("userId planId");
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subscriptions", error: err.message });
  }
});

// Cancel subscription (admin)
router.put("/subscriptions/:id/cancel", async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { isActive: false, endDate: new Date() },
      { new: true }
    );
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    res.json({ message: "Subscription cancelled by admin", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling subscription", error: err.message });
  }
});

// Activate subscription (admin)
router.put("/subscriptions/:id/activate", async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    res.json({ message: "Subscription activated by admin", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error activating subscription", error: err.message });
  }
});

router.delete("/subscriptions/:id", async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: "Subscription deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subscription", error: err.message });
  }
});

module.exports = router;
