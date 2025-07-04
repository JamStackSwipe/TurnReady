import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    region: '',
  });
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, role, region, full_name } = form;

    if (!email || !password || !confirmPassword || !role || !region || !full_name) {
      toast.error('❌ Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('❌ Passwords do not match.');
      return;
    }

    if (!captchaToken) {
      toast.error('❌ Captcha verification failed. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken,
          emailRedirectTo: 'https://www.turnready.pro/confirm',
          data: {
            full_name,
            role,
            region,
          },
        },
      });

      if (error) throw error;

      localStorage.setItem('turnready_role', role);
      toast.success('✅ Signup successful! Please check your email to confirm.');

    } catch (err) {
      toast.error(`Signup failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">🚀 Create Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
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

          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Region</option>
            <option value="Hochatown">Hochatown</option>
            <option value="Broken Bow">Broken Bow</option>
            <option value="Mena">Mena</option>
            <option value="Hot Springs">Hot Springs</option>
            <option value="Other">Other</option>
          </select>

          <Turnstile
            sitekey="0x4AAAAAABiwQGcdykSxvgHa"
            onSuccess={(token) => {
              setCaptchaToken(token);
              console.log('[Turnstile] Success:', token);
            }}
            onError={() => {
              setCaptchaToken('');
              console.warn('[Turnstile] Error');
            }}
            options={{ theme: 'light' }}
          />

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
