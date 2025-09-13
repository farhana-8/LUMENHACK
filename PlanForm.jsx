import React, { useState } from "react";

export default function PlanForm({ setPlans }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Monthly");
  <PlanForm setPlans={setPlans} />

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlans(prev => [...prev, { id: Date.now(), name, price, type }]);
    setName(""); setPrice(""); setType("Monthly");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input 
        type="text" 
        placeholder="Plan Name" 
        value={name} 
        onChange={(e)=>setName(e.target.value)}
        className="border p-2"
        required
      />
      <input 
        type="number" 
        placeholder="Price" 
        value={price} 
        onChange={(e)=>setPrice(e.target.value)}
        className="border p-2"
        required
      />
      <select value={type} onChange={e=>setType(e.target.value)} className="border p-2">
        <option>Monthly</option>
        <option>Yearly</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2">Add</button>
    </form>
  );
}
