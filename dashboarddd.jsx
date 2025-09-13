import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanList from "../components/PlanList";

export default function Dashboard() {
  const navigate = useNavigate();

  // Sample plans
  const [plans, setPlans] = useState([
    { id: 1, name: "Basic", price: 10, type: "Monthly" },
    { id: 2, name: "Pro", price: 100, type: "Yearly" },
    { id: 3, name: "Enterprise", price: 500, type: "Yearly" },
  ]);

  // Sample users with their subscribed plan id
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", planId: 1 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", planId: 2 },
    { id: 3, name: "Alice Brown", email: "alice@example.com", planId: 1 },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Button to manage plans */}
      <button
        onClick={() => navigate("/plans")}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add / Manage Plans
      </button>

      <h2 className="text-xl font-semibold mb-2">Subscription Plans</h2>
      <PlanList plans={plans} setPlans={setPlans} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Users and Their Plans</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Subscribed Plan</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userPlan = plans.find((plan) => plan.id === user.planId);
            return (
              <tr key={user.id}>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{userPlan ? userPlan.name : "None"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
