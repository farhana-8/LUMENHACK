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
    const { userId } = req.body; // normally from auth

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (!plan.isActive) return res.status(400).json({ message: "This plan is inactive" });

    // Expire old subscriptions
    await Subscription.updateMany({ userId, isActive: true }, { $set: { isActive: false } });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    const subscription = await Subscription.create({
      userId,
      planId,
      startDate: new Date(),
      endDate,
      isActive: true
    });

    res.json({ message: "Subscribed successfully", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error subscribing", error: err.message });
  }
});

// ----- Upgrade subscription -----
router.put("/upgrade-subscription/:id/:newPlanId", async (req, res) => {
  try {
    const { id, newPlanId } = req.params;

    const subscription = await Subscription.findById(id);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan) return res.status(404).json({ message: "New plan not found" });
    if (!newPlan.isActive) return res.status(400).json({ message: "New plan is inactive" });

    // Switch plan (upgrade)
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + newPlan.durationDays);

    subscription.planId = newPlan._id;
    subscription.startDate = new Date();
    subscription.endDate = newEndDate;
    subscription.isActive = true;

    await subscription.save();

    res.json({ message: "Subscription upgraded", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error upgrading subscription", error: err.message });
  }
});

// ----- Downgrade subscription -----
router.put("/downgrade-subscription/:id/:newPlanId", async (req, res) => {
  try {
    const { id, newPlanId } = req.params;

    const subscription = await Subscription.findById(id);
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan) return res.status(404).json({ message: "New plan not found" });
    if (!newPlan.isActive) return res.status(400).json({ message: "New plan is inactive" });

    // Switch plan (downgrade)
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + newPlan.durationDays);

    subscription.planId = newPlan._id;
    subscription.startDate = new Date();
    subscription.endDate = newEndDate;
    subscription.isActive = true;

    await subscription.save();

    res.json({ message: "Subscription downgraded", subscription });
  } catch (err) {
    res.status(500).json({ message: "Error downgrading subscription", error: err.message });
  }
});

// ----- Cancel subscription -----
router.put("/cancel-subscription/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
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
    const subscription = await Subscription.findById(req.params.id).populate("planId");
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
