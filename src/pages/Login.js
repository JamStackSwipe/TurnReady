// src/pages/Login.js
import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TurnstileWrapper from '../components/TurnstileWrapper';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (captchaToken) => {
    if (!form.email || !form.password) {
      toast.error('Please enter your email and password.');
      return;
    }

    if (!captchaToken) {
      toast.error('Please complete CAPTCHA');
      return;
    }

    setLoading(true);

    try {
      // 🔐 Sign in user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
        options: { captchaToken },
      });

      if (signInError) throw signInError;

      toast.success('✅ Login successful! Redirecting...');

      // 🎯 Get user and profile role
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('Failed to fetch user info.');
        return;
      }

      const userId = user.id;

      const { data: profile, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (roleError || !profile?.role) {
        toast.error('No role assigned. Please select your role.');
        navigate('/profile');
        return;
      }

      const role = profile.role;
      localStorage.setItem('turnready_role', role);

      // 🚀 Redirect by role
      if (role === 'tech') {
        navigate('/tech-setup');
      } else if (role === 'client') {
        navigate('/client-dashboard');
      } else {
        navigate('/profile'); // fallback
      }
    } catch (err) {
      console.error('[Login Error]', err);
      toast.error(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          🔐 Login to TurnReady
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.email || !form.password) {
              toast.error('Email and password are required.');
              return;
            }
            if (turnstileRef.current) {
              turnstileRef.current.execute();
            }
          }}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <TurnstileWrapper
            ref={turnstileRef}
            siteKey="0x4AAAAAABiwQGcdykSxvgHa"
            onVerify={handleLogin}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Forgot your password?{' '}
          <a href="/reset-password" className="text-blue-600 hover:underline">
            Reset it here
          </a>
        </p>

        <p className="text-sm mt-2 text-center">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
