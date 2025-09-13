import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔹 Clear any stored session (localStorage, cookies, etc.)
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");

    // 🔹 Redirect to login page
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div>
        <Link to="/dashboard" className="mr-4">Dashboard</Link>
        <Link to="/plans" className="mr-4">Plans</Link>
        <Link to="/users" className="mr-4">Users</Link>
        <Link to="/analytics" className="mr-4">Analytics</Link>
        <Link to="/discounts" className="mr-4">Discounts</Link>
      </div>

      {/* 🔹 Logout button on the right side */}
      <button
        onClick={handleLogout}
        className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}
