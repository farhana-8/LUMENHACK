// routes/userRoutes.js
const express = require("express");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const Contact = require("../models/Contact");

const router = express.Router();

// ----- View all active plans -----
router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching plans", error: err.message });
  }
});

// ----- Subscribe to a plan -----
router.post("/subscribe/:planId", async (req, res) => {
  try {
    const { planId } = req.params;
    const { userId } = req.body; // Normally comes from auth middleware

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (!plan.isActive) return res.status(400).json({ message: "This plan is inactive. Please choose another plan." });

    // Expire old subscriptions of the same user
    await Subscription.updateMany(
      { userId, isActive: true },
      { $set: { isActive: false } }
    );

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const subscription = await Subscription.create({
      userId,
      planId: plan._id,
      startDate: new Date(),
      endDate,
      isActive: true
    });

    res.json({ message: "Subscribed successfully", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error subscribing", error: err.message });
  }
});

// ----- Get current user subscription -----
router.get("/my-subscription/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Auto-expire check before returning
    await Subscription.updateMany(
      { userId, endDate: { $lt: new Date() }, isActive: true },
      { $set: { isActive: false } }
    );

    const subscription = await Subscription.findOne({ userId, isActive: true })
      .populate("planId");

    res.json(subscription);
  } catch (err) {
    res.status(500).json({ message: "Error fetching subscription", error: err.message });
  }
});

// ----- Cancel subscription -----
router.put("/cancel-subscription/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { isActive: false, endDate: new Date() },
      { new: true }
    );
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    res.json({ message: "Subscription cancelled", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling subscription", error: err.message });
  }
});

// ----- Renew subscription -----
router.put("/renew-subscription/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id).populate("planId");
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + subscription.planId.durationDays);

    subscription.startDate = new Date();
    subscription.endDate = newEndDate;
    subscription.isActive = true;

    await subscription.save();

    res.json({ message: "Subscription renewed", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error renewing subscription", error: err.message });
  }
});

// ----- Contact Us -----
router.post("/contact", async (req, res) => {
  try {
    const { userId, name, emailId, companyName, subject, message } = req.body;

    const contact = await Contact.create({
      userId,
      name,
      emailId,
      companyName,
      subject,
      message
    });

    res.json({ message: "Message received", contact });
  } catch (err) {
    res.status(500).json({ message: "Error submitting contact form", error: err.message });
  }
});

module.exports = router;
