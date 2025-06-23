// src/pages/Register.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const handleRedirect = (rolePath) => {
    navigate(`/login?next=${encodeURIComponent(rolePath)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Create an Account</h2>

        <button
          onClick={() => handleRedirect('/tech-signup')}
          className="block w-full bg-blue-600 text-white py-3 rounded-lg mb-4 hover:bg-blue-700 transition"
        >
          🛠️ Sign up as a Technician
        </button>

        <button
          onClick={() => handleRedirect('/client-signup')}
          className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          🏡 Sign up as a Client
        </button>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
