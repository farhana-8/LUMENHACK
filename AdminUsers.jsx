import React, { useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  const handleDelete = (id) => setUsers(users.filter(u => u.id !== id));

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Users</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <button 
                  className="bg-red-500 text-white px-2 py-1"
                  onClick={()=>handleDelete(user.id)}
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
