import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboarddd";
import AdminPlans from "./pages/AdminPlans";
import AdminUsers from "./pages/AdminUsers";
import DiscountPage from "./pages/discountplan";
import Navbar from "./components/Navbar";

export default function App() {
  // keep plans state here so all pages can access it
  const [plans, setPlans] = useState([
    { id: 1, name: "Basic", price: 10, type: "Monthly" },
    { id: 2, name: "Pro", price: 100, type: "Yearly" },
    { id: 3, name: "Enterprise", price: 500, type: "Yearly" },
  ]);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard plans={plans} setPlans={setPlans} />} />
          <Route path="/plans" element={<AdminPlans plans={plans} setPlans={setPlans} />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/discounts" element={<DiscountPage plans={plans} />} />
        </Routes>
      </div>
    </div>
  );
}
