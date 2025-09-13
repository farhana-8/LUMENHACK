const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Read database file
const readDatabase = () => {
  try {
    const data = fs.readFileSync('db.json');
    const db = JSON.parse(data);
    // Ensure the discounts array exists
    if (!db.discounts) {
      db.discounts = [];
    }
    return db;
  } catch (error) {
    console.error("Error reading db.json:", error);
    return { plans: [], users: [], subscriptions: [], discounts: [] };
  }
};

// Write to database file
const writeDatabase = (data) => {
  try {
    fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
};

// Get all plans
app.get('/api/plans', (req, res) => {
  const db = readDatabase();
  res.json(db.plans);
});

// Create a new plan
app.post('/api/plans', (req, res) => {
  const db = readDatabase();
  const newPlan = {
    id: db.plans.length > 0 ? Math.max(...db.plans.map(p => p.id)) + 1 : 1,
    ...req.body
  };
  db.plans.push(newPlan);
  writeDatabase(db);
  res.status(201).json(newPlan);
});

// Get a single plan
app.get('/api/plans/:id', (req, res) => {
  const db = readDatabase();
  const plan = db.plans.find(p => p.id === parseInt(req.params.id));
  if (!plan) {
    return res.status(404).send('Plan not found');
  }
  res.json(plan);
});

// Update a plan
app.put('/api/plans/:id', (req, res) => {
  const db = readDatabase();
  const planIndex = db.plans.findIndex(p => p.id === parseInt(req.params.id));
  if (planIndex === -1) {
    return res.status(404).send('Plan not found');
  }
  const updatedPlan = { ...db.plans[planIndex], ...req.body };
  db.plans[planIndex] = updatedPlan;
  writeDatabase(db);
  res.json(updatedPlan);
});

// Delete a plan
app.delete('/api/plans/:id', (req, res) => {
  const db = readDatabase();
  const planIndex = db.plans.findIndex(p => p.id === parseInt(req.params.id));
  if (planIndex === -1) {
    return res.status(404).send('Plan not found');
  }
  db.plans.splice(planIndex, 1);
  writeDatabase(db);
  res.status(204).send();
});

// Discount Management Endpoints
// Create a new discount
app.post('/api/discounts', (req, res) => {
  const db = readDatabase();
  const newDiscount = {
    id: db.discounts.length > 0 ? Math.max(...db.discounts.map(d => d.id)) + 1 : 1,
    ...req.body
  };
  db.discounts.push(newDiscount);
  writeDatabase(db);
  res.status(201).json(newDiscount);
});

// Get all discounts
app.get('/api/discounts', (req, res) => {
  const db = readDatabase();
  res.json(db.discounts);
});

// Get a single discount
app.get('/api/discounts/:id', (req, res) => {
  const db = readDatabase();
  const discount = db.discounts.find(d => d.id === parseInt(req.params.id));
  if (!discount) {
    return res.status(404).send('Discount not found');
  }
  res.json(discount);
});

// Update a discount
app.put('/api/discounts/:id', (req, res) => {
  const db = readDatabase();
  const discountIndex = db.discounts.findIndex(d => d.id === parseInt(req.params.id));
  if (discountIndex === -1) {
    return res.status(404).send('Discount not found');
  }
  const updatedDiscount = { ...db.discounts[discountIndex], ...req.body };
  db.discounts[discountIndex] = updatedDiscount;
  writeDatabase(db);
  res.json(updatedDiscount);
});

// Delete a discount
app.delete('/api/discounts/:id', (req, res) => {
  const db = readDatabase();
  const discountIndex = db.discounts.findIndex(d => d.id === parseInt(req.params.id));
  if (discountIndex === -1) {
    return res.status(404).send('Discount not found');
  }
  db.discounts.splice(discountIndex, 1);
  writeDatabase(db);
  res.status(204).send();
});

// Get all users for testing
app.get('/api/users', (req, res) => {
    const db = readDatabase();
    res.json(db.users);
});

// Subscribe a user to a plan with an optional discount
app.post('/api/subscriptions', (req, res) => {
  const { userId, planId, discountCode } = req.body;
  const db = readDatabase();

  // Check if user and plan exist
  const user = db.users.find(u => u.id === userId);
  const plan = db.plans.find(p => p.id === planId);

  if (!user || !plan) {
    return res.status(404).send('User or Plan not found');
  }

  // Check if user already has a subscription
  const existingSubscription = db.subscriptions.find(s => s.userId === userId && s.status === 'active');
  if (existingSubscription) {
    return res.status(400).send('User is already subscribed to a plan. Please update or cancel the existing one.');
  }

  let finalPrice = plan.price;
  let appliedDiscount = null;

  // Apply discount if a code is provided
  if (discountCode) {
    const discount = db.discounts.find(d => d.code === discountCode && d.active);
    if (discount) {
      finalPrice = plan.price * (1 - discount.percentage / 100);
      appliedDiscount = discount.code;
    } else {
      return res.status(400).send('Invalid or inactive discount code.');
    }
  }

  const newSubscription = {
    id: db.subscriptions.length > 0 ? Math.max(...db.subscriptions.map(s => s.id)) + 1 : 1,
    userId,
    planId,
    startDate: new Date().toISOString(),
    status: 'active',
    finalPrice,
    appliedDiscount
  };

  db.subscriptions.push(newSubscription);
  writeDatabase(db);

  res.status(201).json(newSubscription);
});

// Get a user's subscription
app.get('/api/users/:userId/subscription', (req, res) => {
  const db = readDatabase();
  const subscription = db.subscriptions.find(s => s.userId === parseInt(req.params.userId) && s.status === 'active');
  if (!subscription) {
    return res.status(404).send('Active subscription not found for this user');
  }
  res.json(subscription);
});

// Cancel a user's subscription
app.delete('/api/users/:userId/subscription', (req, res) => {
  const db = readDatabase();
  const subIndex = db.subscriptions.findIndex(s => s.userId === parseInt(req.params.userId) && s.status === 'active');
  if (subIndex === -1) {
    return res.status(404).send('Active subscription not found for this user');
  }

  // Instead of deleting, we mark it as cancelled
  db.subscriptions[subIndex].status = 'cancelled';
  db.subscriptions[subIndex].endDate = new Date().toISOString();

  writeDatabase(db);
  res.status(200).json(db.subscriptions[subIndex]);
});

// Get top plans by subscription
app.get('/api/analytics/topplans', (req, res) => {
  const db = readDatabase();
  const planCounts = db.subscriptions.reduce((acc, subscription) => {
    acc[subscription.planId] = (acc[subscription.planId] || 0) + 1;
    return acc;
  }, {});

  const sortedPlans = Object.keys(planCounts)
    .map(planId => {
      const plan = db.plans.find(p => p.id === parseInt(planId));
      return {
        ...plan,
        subscriberCount: planCounts[planId]
      };
    })
    .sort((a, b) => b.subscriberCount - a.subscriberCount);

  res.json(sortedPlans);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

