// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Simple top navbar for TurnReady
 * TODO (optional): Add user-based logic to show/hide links for tech, client, or admin roles
 */
const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">TurnReady</Link>
      <div className="space-x-4">
        <Link to="/submit-job" className="text-gray-700 hover:text-blue-600">Submit Job</Link>
        <Link to="/job-board" className="text-gray-700 hover:text-blue-600">Job Board</Link>
        <Link to="/tech-dashboard" className="text-gray-700 hover:text-blue-600">Tech Dashboard</Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;
