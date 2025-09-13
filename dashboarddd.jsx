import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanList from "../components/planlist";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plans and users from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, usersRes] = await Promise.all([
          axios.get("/api/plans"),  // Replace with your API endpoint
          axios.get("/api/users"),  // Replace with your API endpoint
        ]);
        setPlans(plansRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`); // Backend DELETE endpoint
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Button to navigate to Plans page */}
      <button
        onClick={() => navigate("/plans")}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add / Manage Plans
      </button>

      {/* Plans Table */}
      <h2 className="text-xl font-semibold mb-2">Subscription Plans</h2>
      <PlanList plans={plans} setPlans={setPlans} />

      {/* Users Table */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Users and Their Plans</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Subscribed Plan</th>
            <th className="border p-2">Actions</th>
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
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


