// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './AuthProvider';
import { supabase } from '../supabaseClient';
import { Menu, X } from 'lucide-react'; // Make sure lucide-react is installed

const Navbar = () => {
  const { user, profile } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const renderLinks = () => (
    <>
      {profile?.role === 'client' && (
        <>
          <Link to="/submit-job" className="nav-link">Submit Job</Link>
          <Link to="/client-dashboard" className="nav-link">Dashboard</Link>
          <Link to="/my-properties" className="nav-link">My Properties</Link>
        </>
      )}
      {profile?.role === 'tech' && (
        <>
          <Link to="/tech-dashboard" className="nav-link">My Jobs</Link>
          <Link to="/complete-job" className="nav-link">Complete Job</Link>
        </>
      )}
      {profile?.role === 'admin' && (
        <>
          <Link to="/admin" className="nav-link">Admin</Link>
          <Link to="/admin/jobs" className="nav-link">Jobs</Link>
          <Link to="/admin/users" className="nav-link">Users</Link>
        </>
      )}
      <Link to="/job-board" className="nav-link">Job Board</Link>
      <Link to="/profile" className="nav-link">Profile</Link>
      {user ? (
        <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
      ) : (
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">TurnReady</Link>
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4 items-center">
        {renderLinks()}
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md md:hidden flex flex-col space-y-3 px-6 py-4 z-50">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
