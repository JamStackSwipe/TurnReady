// src/pages/ForgotPassword.js

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    });

    if (error) {
      console.error('Reset error:', error.message);
      toast.error('Failed to send reset link');
    } else {
      setSubmitted(true);
      toast.success('Reset link sent! Check your email.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4 text-blue-700">🔐 Forgot Password</h2>
      {submitted ? (
        <p className="text-green-600">Check your email for a reset link.</p>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
