import React, { useState } from "react";
import DiscountForm from "../components/discountform";
import DiscountList from "../components/discountlist";

export default function DiscountPage({ plans }) {
  const [discounts, setDiscounts] = useState([]);

  if (!plans || plans.length === 0) {
    return <p className="text-red-500">No plans available. Please add plans first.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Discounts</h1>

      <DiscountForm discounts={discounts} setDiscounts={setDiscounts} plans={plans} />
      <DiscountList discounts={discounts} setDiscounts={setDiscounts} plans={plans} />
    </div>
  );
}
