const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

// Read database file
const readDatabase = () => {
  const data = fs.readFileSync('db.json');
  return JSON.parse(data);
};

// Write to database file
const writeDatabase = (data) => {
  fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
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
    return res.status(404).send('Plan not.found');
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

// Get all users for testing
app.get('/api/users', (req, res) => {
    const db = readDatabase();
    res.json(db.users);
});

// Subscribe a user to a plan
app.post('/api/subscriptions', (req, res) => {
  const { userId, planId } = req.body;
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

  const newSubscription = {
    id: db.subscriptions.length > 0 ? Math.max(...db.subscriptions.map(s => s.id)) + 1 : 1,
    userId,
    planId,
    startDate: new Date().toISOString(),
    status: 'active'
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