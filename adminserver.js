const express = require('express');
const mongoose = require('mongoose');
//do
const app = express();
const port = 3000;

app.use(express.json());

// MongoDB Connection String
const mongoUri = 'mongodb+srv://TeamLumen:Lumen12345@cluster0.02bnupq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//connect
// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    // Start the server only after a successful database connection
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1); // Exit the process with an error
  });

// Define Mongoose Schemas
const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], default: [] }
});

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  percentage: { type: Number, required: true },
  active: { type: Boolean, default: true }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }
  // You can add more user fields here if needed
});

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  finalPrice: { type: Number, required: true },
  appliedDiscount: { type: String }
});

// Define Mongoose Models
const Plan = mongoose.model('Plan', planSchema);
const Discount = mongoose.model('Discount', discountSchema);
const User = mongoose.model('User', userSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// ---- API Endpoints ----

// Plans Endpoints
// Create a new plan
app.post('/api/plans', async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Get all plans
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve plans' });
  }
});

// Get a single plan
app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).send('Plan not found');
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve plan' });
  }
});

// Update a plan
app.put('/api/plans/:id', async (req, res) => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlan) {
      return res.status(404).send('Plan not found');
    }
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete a plan
app.delete('/api/plans/:id', async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).send('Plan not found');
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Discount Management Endpoints
// Create a new discount
app.post('/api/discounts', async (req, res) => {
  try {
    const newDiscount = new Discount(req.body);
    await newDiscount.save();
    res.status(201).json(newDiscount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create discount' });
  }
});

// Get all discounts
app.get('/api/discounts', async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve discounts' });
  }
});

// Get a single discount
app.get('/api/discounts/:id', async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) {
      return res.status(404).send('Discount not found');
    }
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve discount' });
  }
});

// Update a discount
app.put('/api/discounts/:id', async (req, res) => {
  try {
    const updatedDiscount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDiscount) {
      return res.status(404).send('Discount not found');
    }
    res.json(updatedDiscount);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update discount' });
  }
});

// Delete a discount
app.delete('/api/discounts/:id', async (req, res) => {
  try {
    const deletedDiscount = await Discount.findByIdAndDelete(req.params.id);
    if (!deletedDiscount) {
      return res.status(404).send('Discount not found');
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete discount' });
  }
});

// User Endpoints for testing purposes
// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Add a test user
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Subscription Endpoints
// Subscribe a user to a plan with an optional discount
app.post('/api/subscriptions', async (req, res) => {
  const { userId, planId, discountCode } = req.body;

  try {
    // Find user and plan by their IDs
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    if (!user || !plan) {
      return res.status(404).send('User or Plan not found');
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({ userId, status: 'active' });
    if (existingSubscription) {
      return res.status(400).send('User is already subscribed to a plan. Please update or cancel the existing one.');
    }

    let finalPrice = plan.price;
    let appliedDiscount = null;

    // Apply discount if a code is provided
    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode, active: true });
      if (discount) {
        finalPrice = plan.price * (1 - discount.percentage / 100);
        appliedDiscount = discount.code;
      } else {
        return res.status(400).send('Invalid or inactive discount code.');
      }
    }

    const newSubscription = new Subscription({
      userId: user._id,
      planId: plan._id,
      finalPrice,
      appliedDiscount
    });

    await newSubscription.save();
    res.status(201).json(newSubscription);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Get a user's subscription
app.get('/api/users/:userId/subscription', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.params.userId, status: 'active' }).populate('planId');
    if (!subscription) {
      return res.status(404).send('Active subscription not found for this user');
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve subscription' });
  }
});

// Cancel a user's subscription
app.delete('/api/users/:userId/subscription', async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.params.userId, status: 'active' },
      { status: 'cancelled', endDate: new Date() },
      { new: true }
    );
    if (!subscription) {
      return res.status(404).send('Active subscription not found for this user');
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get top plans by subscription
app.get('/api/analytics/topplans', async (req, res) => {
  try {
    const planCounts = await Subscription.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$planId',
          subscriberCount: { $sum: 1 }
        }
      },
      { $sort: { subscriberCount: -1 } },
      {
        $lookup: {
          from: 'plans',
          localField: '_id',
          foreignField: '_id',
          as: 'planDetails'
        }
      },
      { $unwind: '$planDetails' },
      {
        $project: {
          _id: 0,
          name: '$planDetails.name',
          price: '$planDetails.price',
          features: '$planDetails.features',
          subscriberCount: '$subscriberCount'
        }
      }
    ]);
    res.json(planCounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});
