import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-4">
      <Link to="/">Dashboard</Link>
      <Link to="/plans">Plans</Link>
      <Link to="/users">Users</Link>
      <Link to="/discounts">Discounts</Link>
    </nav>
  );
}
