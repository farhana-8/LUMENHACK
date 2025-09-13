import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Example mock users (replace with real API later)
const mockUsers = [
  { id: 1, name: "Alice", subscription: "Monthly" },
  { id: 2, name: "Bob", subscription: "Yearly" },
  { id: 3, name: "Charlie", subscription: "Monthly" },
  { id: 4, name: "David", subscription: "Monthly" },
  { id: 5, name: "Eve", subscription: "Quarterly" },
  { id: 6, name: "Frank", subscription: "Yearly" },
];

export default function Analytics() {
  const [data, setData] = useState([]);
  const [mostUsed, setMostUsed] = useState(null);

  useEffect(() => {
    // Count subscriptions
    const counts = mockUsers.reduce((acc, user) => {
      acc[user.subscription] = (acc[user.subscription] || 0) + 1;
      return acc;
    }, {});

    // Convert to recharts format
    const chartData = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));

    setData(chartData);

    // Find most used subscription
    const max = chartData.reduce((prev, curr) =>
      curr.value > prev.value ? curr : prev
    );
    setMostUsed(max.name);
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Subscription Analytics</h1>

      <div className="mb-4">
        <p>Total Users: {mockUsers.length}</p>
        <p>Most Popular Plan: <b>{mostUsed}</b></p>
      </div>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
