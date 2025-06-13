// src/pages/AdminDashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧠 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin/jobs')}
          className="cursor-pointer p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">🛠 Job Submissions</h2>
          <p className="text-gray-600 text-sm">View all jobs, status, assignments, and regional coverage.</p>
        </div>

        <div
          onClick={() => navigate('/admin/reviews')}
          className="cursor-pointer p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">⭐ Reviews & Ratings</h2>
          <p className="text-gray-600 text-sm">Browse all tech and client reviews. Filter flags and feedback.</p>
        </div>

        <div
          onClick={() => navigate('/admin/users')}
          className="cursor-pointer p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">👥 Users</h2>
          <p className="text-gray-600 text-sm">Lookup any tech or client. View jobs, documents, and red flags.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
