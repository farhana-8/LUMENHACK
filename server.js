import express from "express";
import { z } from "zod";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
//server.js
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://TeamLumen:Lumen12345@cluster0.02bnupq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Atlas Connected...");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};
connectDB();

dotenv.config();
const PORT = process.env.PORT || 8000;
const ADMIN_KEY = process.env.ADMIN_KEY || "change_me_admin_key";

const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---- in-memory stores ----
const users = new Map();
const plans = new Map();
const subs = new Map();
const usage = new Map();
const discounts = [];
const notifications = [];
const auditEvents = [];
const tickets = [];

// seed
(function seed() {
  const now = new Date().toISOString();
  const u1 = { id: uuid(), email: "user@sms.com", name: "Demo User", phone: "9999999999", createdAt: now };
  const admin = { id: uuid(), email: "admin@sms.com", name: "Admin", createdAt: now };
  users.set(u1.email, u1);
  users.set(admin.email, admin);

  plans.set("p1", { id: "p1", name: "Basic Fibernet", speedMbps: 50, quotaGb: 100, priceMinor: 29900, currency: "INR", features: ["Email support"], status: "ACTIVE" });
  plans.set("p2", { id: "p2", name: "Standard Fibernet", speedMbps: 100, quotaGb: 500, priceMinor: 49900, currency: "INR", features: ["Priority support"], status: "ACTIVE" });
  plans.set("p3", { id: "p3", name: "Premium Fibernet", speedMbps: 300, quotaGb: 1000, priceMinor: 79900, currency: "INR", features: ["24x7 support"], status: "ACTIVE" });

  discounts.push({ id: uuid(), name: "Festival 10%", type: "PERCENT", value: 10, active: true, conditions: { planIds: ["p2"] } });

  const s1 = { id: uuid(), user_id: u1.id, plan_id: "p1", status: "ACTIVE", autoRenew: true, startAt: now, cancelAt: null };
  subs.set(s1.id, s1);
  usage.set(s1.id, [{ periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1), periodEnd: new Date(), usedGb: 82 }]);
})();

// utils
const money = (m, c = "INR") => `${c === "INR" ? "₹" : ""}${(m / 100).toFixed(2)}`;
const err = (code, message, hint = "") => ({ error: { code, message, hint } });
const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch(e => { console.error(e); res.status(500).json(err("INTERNAL_ERROR","Something went wrong")); });
const requireAdmin = (req, res, next) => (String(req.headers["x-admin-key"]) === ADMIN_KEY) ? next() : res.status(403).json(err("FORBIDDEN","Invalid ADMIN_KEY"));
const loadUser = (req, res, next) => {
  const email = (req.headers["x-user-email"] || req.query.email || req.body.email || "").toString();
  if (!email) return res.status(400).json(err("BAD_REQUEST","Email required"));
  const u = users.get(email);
  if (!u) return res.status(404).json(err("NOT_FOUND","User not found"));
  req.user = u; next();
};

// schemas
const signupSchema = z.object({ email: z.string().email(), phone: z.string().min(7).max(20).optional(), name: z.string().optional() });
const loginSchema = z.object({ email: z.string().email() });
const createPlanSchema = z.object({ id: z.string().optional(), name: z.string(), speedMbps: z.number().int().positive(), quotaGb: z.number().int().positive(), priceMinor: z.number().int().positive(), currency: z.string().default("INR"), features: z.array(z.string()).default([]), status: z.enum(["ACTIVE","HIDDEN","RETIRED"]).default("ACTIVE") });
const updatePlanSchema = createPlanSchema.partial();
const subscribeSchema = z.object({ planId: z.string(), autoRenew: z.boolean().default(true) });
const changeSchema = z.object({ action: z.enum(["upgrade","downgrade","cancel","renew"]), toPlanId: z.string().optional() });
const discountCreateSchema = z.object({ name: z.string(), type: z.enum(["PERCENT","FLAT"]), value: z.number().int().positive(), active: z.boolean().default(true), conditions: z.any().default({}), planId: z.string().optional() });
const discountUpdateSchema = discountCreateSchema.partial();
const contactSchema = z.object({ message: z.string().min(5).max(2000) });

// auth
app.post("/v1/auth/signup", wrap((req, res) => {
  const p = signupSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  if (users.has(p.data.email)) return res.status(400).json(err("USER_EXISTS","Email already registered"));
  const u = { id: uuid(), email: p.data.email, name: p.data.name || null, phone: p.data.phone || null, createdAt: new Date().toISOString() };
  users.set(u.email, u);
  res.status(201).json({ message: "Signup successful", user: u });
}));
app.post("/v1/auth/login", wrap((req, res) => {
  const p = loginSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  const u = users.get(p.data.email);
  if (!u) return res.status(404).json(err("NOT_FOUND","User not found"));
  res.json({ message: "Login ok", user: u });
}));

// plans
app.get("/v1/plans", wrap((_req, res) => {
  const data = Array.from(plans.values())
    .filter(p => p.status === "ACTIVE")
    .sort((a,b)=>a.priceMinor-b.priceMinor)
    .map(p => ({ ...p, price: { amount: p.priceMinor, currency: p.currency, display: money(p.priceMinor, p.currency) }}));
  res.json({ data });
}));
app.post("/v1/plans", requireAdmin, wrap((req, res) => {
  const p = createPlanSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  const id = p.data.id || uuid();
  if (plans.has(id)) return res.status(400).json(err("PLAN_EXISTS","Plan ID already exists"));
  const plan = { ...p.data, id };
  plans.set(id, plan);
  res.status(201).json({ plan });
}));
app.patch("/v1/plans/:id", requireAdmin, wrap((req, res) => {
  const { id } = req.params;
  if (!plans.has(id)) return res.status(404).json(err("NOT_FOUND","Plan not found"));
  const p = updatePlanSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  const merged = { ...plans.get(id), ...p.data };
  plans.set(id, merged);
  res.json({ plan: merged });
}));
app.delete("/v1/plans/:id", requireAdmin, wrap((req, res) => {
  const { id } = req.params;
  if (!plans.has(id)) return res.status(404).json(err("NOT_FOUND","Plan not found"));
  plans.delete(id);
  res.json({ message: "Deleted" });
}));

// discounts
app.get("/v1/discounts", requireAdmin, wrap((_req, res) => res.json({ data: discounts })));
app.post("/v1/discounts", requireAdmin, wrap((req, res) => {
  const p = discountCreateSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  const d = { id: uuid(), ...p.data }; discounts.push(d);
  res.status(201).json({ discount: d });
}));
app.patch("/v1/discounts/:id", requireAdmin, wrap((req, res) => {
  const i = discounts.findIndex(d => d.id === req.params.id);
  if (i === -1) return res.status(404).json(err("NOT_FOUND","Discount not found"));
  const p = discountUpdateSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  discounts[i] = { ...discounts[i], ...p.data };
  res.json({ discount: discounts[i] });
}));

// subs
const applicableDiscounts = (planId) => discounts.filter(d => d.active && ((d.conditions?.planIds||[]).length ? d.conditions.planIds.includes(planId) : true));
const applyDiscounts = (priceMinor, ds) => ds.reduce((acc, d) => d.type==="PERCENT" ? Math.max(0, Math.round(acc*(100-d.value)/100)) : Math.max(0, acc-d.value), priceMinor);

app.get("/v1/subscriptions", loadUser, wrap((req, res) => {
  const mine = Array.from(subs.values()).filter(s => s.user_id === req.user.id);
  const data = mine.map(s => {
    const p = plans.get(s.plan_id);
    return { ...s, plan: { ...p, price: { amount: p.priceMinor, currency: p.currency, display: money(p.priceMinor, p.currency) } } };
  });
  res.json({ data });
}));
app.get("/v1/subscriptions/active", loadUser, wrap((req, res) => {
  const s = Array.from(subs.values()).find(v => v.user_id === req.user.id && v.status === "ACTIVE");
  if (!s) return res.json({ message: "No active subscriptions" });
  const p = plans.get(s.plan_id);
  res.json({ data: { ...s, plan: { ...p, price: { amount: p.priceMinor, currency: p.currency, display: money(p.priceMinor, p.currency) } } } });
}));
app.get("/v1/subscriptions/recommendations", loadUser, wrap((req, res) => {
  const active = Array.from(subs.values()).find(v => v.user_id === req.user.id && v.status === "ACTIVE");
  const livePlans = Array.from(plans.values()).filter(p => p.status === "ACTIVE").sort((a,b)=>a.quotaGb-b.quotaGb);
  const out = [];
  if (!active) { out.push({ planId: livePlans[0].id, explanation: "Best starter based on new users" }); }
  else {
    const last = (usage.get(active.id) || []).slice(-1)[0];
    const usedPct = last ? (last.usedGb / plans.get(active.plan_id).quotaGb) * 100 : 0;
    const better = livePlans.find(p => p.quotaGb > plans.get(active.plan_id).quotaGb);
    if (usedPct > 80 && better) out.push({ planId: better.id, explanation: `You used ~${usedPct.toFixed(0)}% of quota. Consider a higher plan.` });
  }
  res.json({ data: out });
}));
app.post("/v1/subscriptions", loadUser, wrap((req, res) => {
  const p = subscribeSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  const plan = plans.get(p.data.planId);
  if (!plan) return res.status(404).json(err("PLAN_NOT_FOUND","Plan not found"));
  for (const s of subs.values()) if (s.user_id === req.user.id && s.status === "ACTIVE") { s.status="CANCELLED"; s.cancelAt=new Date().toISOString(); }
  const s = { id: uuid(), user_id: req.user.id, plan_id: plan.id, status:"ACTIVE", autoRenew: !!p.data.autoRenew, startAt:new Date().toISOString(), cancelAt:null };
  subs.set(s.id, s);
  const ds = applicableDiscounts(plan.id);
  const final = applyDiscounts(plan.priceMinor, ds);
  notifications.push({ id: uuid(), userId: req.user.id, type:"subscription.updated", payload:{ subscriptionId:s.id, action:"SUBSCRIBE", priceAfterDiscount: final }, status:"queued", createdAt:new Date().toISOString() });
  res.status(201).json({ message:"Subscribed successfully", subscription:s, priceAfterDiscountMinor: final });
}));
app.patch("/v1/subscriptions/:id", loadUser, wrap((req, res) => {
  const p = changeSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  const s = subs.get(req.params.id);
  if (!s || s.user_id !== req.user.id) return res.status(404).json(err("NOT_FOUND","Subscription not found"));
  if (p.data.action === "cancel") { s.status="CANCELLED"; s.cancelAt=new Date().toISOString(); return res.json({ message:"Cancelled", subscription:s }); }
  if (p.data.action === "renew")  { s.status="ACTIVE"; s.cancelAt=null; return res.json({ message:"Renewed", subscription:s }); }
  if ((p.data.action === "upgrade" || p.data.action === "downgrade")) {
    const np = plans.get(p.data.toPlanId || "");
    if (!np) return res.status(404).json(err("PLAN_NOT_FOUND","toPlanId invalid"));
    s.plan_id = np.id; return res.json({ message:"Changed", subscription:s });
  }
  res.status(400).json(err("BAD_REQUEST","Unknown action"));
}));

// usage
app.get("/v1/usage/current", loadUser, wrap((req, res) => {
  const active = Array.from(subs.values()).find(v => v.user_id === req.user.id && v.status === "ACTIVE");
  if (!active) return res.json({ message: "No active subscription" });
  const rec = (usage.get(active.id) || []).slice(-1)[0] || { usedGb: 0, periodStart: null, periodEnd: null };
  res.json({ data: rec });
}));

// analytics (admin)
app.get("/v1/analytics/top-plans", (req, res, next) => requireAdmin(req, res, next), wrap((_req, res) => {
  const counts = {}; for (const s of subs.values()) counts[s.plan_id] = (counts[s.plan_id] || 0) + 1;
  const data = Array.from(plans.values()).map(p => ({ planId:p.id, name:p.name, count: counts[p.id] || 0 })).sort((a,b)=>b.count-a.count);
  res.json({ data });
}));

// contact
app.post("/v1/contact-us", loadUser, wrap((req, res) => {
  const p = z.object({ message: z.string().min(5).max(2000) }).safeParse(req.body);
  if (!p.success) return res.status(400).json(err("BAD_REQUEST","Invalid payload", p.error.message));
  const t = { id: uuid(), userId: req.user.id, message: p.data.message, status:"received", createdAt:new Date().toISOString() };
  tickets.push(t); res.status(201).json({ message:"We received your query", ticket: t });
}));
app.get("/", (_req, res) => {
  res.json({
    name: "SMS backend (in-memory)",
    docs: {
      health: "/health",
      plans: "/v1/plans",
      activeSubscription: "/v1/subscriptions/active (needs x-user-email)",
      recommend: "/v1/subscriptions/recommendations (needs x-user-email)"
    }
  });
});


// 404
app.use((_req, res) => res.status(404).json(err("NOT_FOUND","Route not found")));

app.listen(PORT, () => console.log(`SMS (in-memory) running on http://localhost:${PORT}`));


