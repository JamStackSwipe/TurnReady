// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl text-center">
        <img
          src="/logo.png"
          alt="TurnReady Logo"
          className="w-28 h-28 mx-auto mb-4 rounded-full border-2 border-gray-300"
        />
        <h1 className="text-3xl font-bold mb-4 text-blue-700">🔧 Welcome to TurnReady</h1>
        <p className="text-gray-700 mb-6">
          The fastest way to get your short-term rentals back online. Book a technician, get verified service, and track progress — all in one place.
        </p>
        <div className="space-y-4">
          <Link
            to="/submit-job"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            📤 Submit a Job
          </Link>
          <Link
            to="/tech-setup"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            🧰 Become a Tech
          </Link>
          <Link
            to="/client-dashboard"
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            📋 Client Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
