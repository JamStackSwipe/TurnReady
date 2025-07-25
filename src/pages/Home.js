import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../components/AuthProvider';

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redirect to reset-password page if URL contains recovery token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'recovery' && params.get('access_token')) {
      navigate('/reset-password' + location.search);
    }
  }, [location, navigate]);

  const handleTechClick = () => {
    if (user) {
      navigate('/tech-dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleClientClick = () => {
    if (user) {
      navigate('/client-dashboard');
    } else {
      navigate('/login');
    }
  };

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
            to="/submit-job"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            📤 Submit a Job
          </Link>

          <button
            onClick={handleTechClick}
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            🛠 Tech Dashboard
          </button>

          <button
            onClick={handleClientClick}
            className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            🧾 Client Dashboard
          </button>

          <Link
            to="/register"
            className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl transition"
          >
            ✍️ Not Registered Yet? Sign Up
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
