import React, { useState } from "react";
import PlanForm from "../components/PlanForm";
import PlanList from "../components/PlanList";

export default function AdminPlans() {
  const [plans, setPlans] = useState([
    { id: 1, name: "Basic", price: 10, type: "Monthly" },
    { id: 2, name: "Pro", price: 100, type: "Yearly" },
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Plans</h1>
      <PlanForm setPlans={setPlans} />
      <PlanList plans={plans} setPlans={setPlans} />
    </div>
  );
}
