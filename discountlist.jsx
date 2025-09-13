import React from "react";

export default function DiscountList({ discounts, setDiscounts, plans }) {
  const handleDelete = (id) => {
    setDiscounts(discounts.filter((d) => d.id !== id));
  };

  const getPlanName = (planId) => plans.find((p) => p.id === planId)?.name || "Unknown";

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border p-2">Plan</th>
          <th className="border p-2">Discount (%)</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {discounts.map((d) => (
          <tr key={d.id}>
            <td className="border p-2">{getPlanName(d.planId)}</td>
            <td className="border p-2">{d.percent}</td>
            <td className="border p-2">
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(d.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
