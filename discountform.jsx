import React, { useState } from "react";

export default function DiscountForm({ discounts, setDiscounts, plans }) {
  const [planId, setPlanId] = useState(plans[0]?.id || "");
  const [percent, setPercent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setDiscounts([
      ...discounts,
      { id: Date.now(), planId: Number(planId), percent: Number(percent) },
    ]);
    setPercent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <select
        value={planId}
        onChange={(e) => setPlanId(e.target.value)}
        className="border p-2"
      >
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Discount %"
        value={percent}
        onChange={(e) => setPercent(e.target.value)}
        className="border p-2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Discount
      </button>
    </form>
  );
}
