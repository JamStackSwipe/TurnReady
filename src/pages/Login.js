// src/pages/Login.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Add Link from react-router-dom
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Check your email for the login link!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login to TurnReady</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Login Link
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-1">Don't have an account?</p>
          <p>
            👉 <Link to="/signup/tech" className="text-blue-600 hover:underline">Sign up as a Technician</Link>
          </p>
          <p>
            👉 <Link to="/signup/client" className="text-blue-600 hover:underline">Sign up as a Client</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
