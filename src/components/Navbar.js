// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './AuthProvider';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const { user, profile } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">TurnReady</Link>
      <div className="space-x-4 flex items-center">
        {profile?.role === 'client' && (
          <>
            <Link to="/submit-job" className="text-gray-700 hover:text-blue-600">Submit Job</Link>
            <Link to="/client-dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
            <Link to="/my-properties" className="text-gray-700 hover:text-blue-600">My Properties</Link>
          </>
        )}
        {profile?.role === 'tech' && (
          <>
            <Link to="/tech-dashboard" className="text-gray-700 hover:text-blue-600">My Jobs</Link>
            <Link to="/complete-job" className="text-gray-700 hover:text-blue-600">Complete Job</Link>
          </>
        )}
        {profile?.role === 'admin' && (
          <>
            <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
            <Link to="/admin/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
            <Link to="/admin/users" className="text-gray-700 hover:text-blue-600">Users</Link>
          </>
        )}
        <Link to="/job-board" className="text-gray-700 hover:text-blue-600">Job Board</Link>
        <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
        {user ? (
          <button onClick={handleLogout} className="text-red-600 hover:underline ml-2">Logout</button>
        ) : (
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
