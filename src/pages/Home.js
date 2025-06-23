import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-xl text-center border border-blue-100">
        <img
          src="/logo.png"
          alt="TurnReady Logo"
          className="w-28 h-28 mx-auto mb-6 rounded-full border-4 border-blue-200 shadow-md"
        />
        <h1 className="text-4xl font-bold text-blue-700 mb-3">🔧 Welcome to TurnReady</h1>
        <p className="text-gray-600 text-lg mb-8">
          Fast, verified service for your short-term rental properties.
          Book technicians, track jobs, and stay turn-ready 24/7.
        </p>

        <div className="space-y-4">
          <Link
            to="/register"
            className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            ✨ First Time? Create Account
          </Link>
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
      <p className="text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} TurnReady.pro – All rights reserved.
      </p>
    </div>
  );
};

export default Home;
