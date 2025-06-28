import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  // Turnstile site key from your Cloudflare dashboard
  const siteKey = 'YOUR_TURNSTILE_SITE_KEY'; // ← replace this with your real one

  useEffect(() => {
    // Inject Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Setup listener to capture token
    window.turnstileCallback = function (token) {
      setToken(token);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.role) {
      toast.error('❌ Please select a role (Tech or Client).');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('❌ Passwords do not match.');
      return;
    }

    if (!token) {
      toast.error('❌ Please complete the Turnstile verification.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      localStorage.setItem('turnready_role', form.role);
      toast.success('✅ Signup successful! Check your email to confirm.');

      if (form.role === 'tech') {
        navigate('/tech-setup');
      } else {
        navigate('/client-signup');
      }
    } catch (err) {
      console.error(err);
      toast.error(`Signup failed: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">🚀 Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Create a Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Role</option>
            <option value="tech">Technician</option>
            <option value="client">Client</option>
          </select>

          {/* Turnstile Widget */}
          <div
            className="cf-turnstile"
            data-sitekey={siteKey}
            data-callback="turnstileCallback"
          ></div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Signing up...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
