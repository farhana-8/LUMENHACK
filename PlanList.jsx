import React from "react";

export default function PlanList({ plans, setPlans }) {
  const handleDelete = (id) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  return (
    <table className="w-full border mb-6">
      <thead>
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Price</th>
          <th className="border p-2">Type</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {plans.map(plan => (
          <tr key={plan.id}>
            <td className="border p-2">{plan.name}</td>
            <td className="border p-2">{plan.price}</td>
            <td className="border p-2">{plan.type}</td>
            <td className="border p-2">
              <button
                className="bg-red-500 text-white px-2 py-1"
                onClick={() => handleDelete(plan.id)}
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
