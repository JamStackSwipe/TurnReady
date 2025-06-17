// src/pages/Register.js

import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Create an Account</h2>

        <Link
          to="/tech-signup"
          className="block bg-blue-600 text-white py-3 rounded-lg mb-4 hover:bg-blue-700 transition"
        >
          🛠️ Sign up as a Technician
        </Link>

        <Link
          to="/client-signup"
          className="block bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          🏡 Sign up as a Client
        </Link>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
