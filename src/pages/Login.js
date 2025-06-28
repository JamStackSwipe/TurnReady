// src/pages/Login.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TurnstileWrapper from '../components/TurnstileWrapper';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
        options: {
          captchaToken,
        },
      });

      if (error) throw error;

      toast.success('✅ Login successful! Redirecting...');

      setTimeout(async () => {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          toast.error('Failed to fetch user info.');
          return;
        }

        const userId = user.id;

        const { data: techProfile } = await supabase
          .from('tech_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (techProfile) {
          localStorage.setItem('turnready_role', 'tech');
          navigate('/tech-dashboard');
          return;
        }

        const { data: clientProfile } = await supabase
          .from('client_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (clientProfile) {
          localStorage.setItem('turnready_role', 'client');
          navigate('/client-dashboard');
          return;
        }

        navigate('/choose-role');
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(`Login failed: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          🔐 Login to TurnReady
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
            siteKey="0x4AAAAAABiwQGcdykSxvgHa"
            onVerify={(token) => setCaptchaToken(token)}
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
          <a href="/resetpassword" className="text-blue-600 hover:underline">
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
