// src/pages/ClientSignup.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TurnstileWrapper from '../components/TurnstileWrapper';

const ClientSignup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    region: '',
    custom_region: '',
    agree_terms: false,
  });

  const [captchaToken, setCaptchaToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree_terms) {
      toast.error('❌ You must agree to the terms.');
      return;
    }

    if (!captchaToken) {
      toast.error('❌ Bot verification failed. Please try again.');
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Create Supabase Auth user with CAPTCHA token
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          captchaToken, // ✅ required if CAPTCHA enabled
        },
      });

      if (signUpError) throw signUpError;

      // Step 2: Get user ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) throw new Error('User creation failed.');

      const userId = userData.user.id;

      // Step 3: Insert into client_profiles
      const { error: profileError } = await supabase.from('client_profiles').insert([
        {
          user_id: userId,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          region: form.region === 'Other' ? form.custom_region : form.region,
          status: 'active',
        },
      ]);

      if (profileError) throw profileError;

      localStorage.setItem('turnready_role', 'client');
      toast.success('✅ Signup complete! Please check your email to confirm.');
      navigate('/client-dashboard');
    } catch (err) {
      console.error(err);
      toast.error(`Signup failed: ${err.message}`);
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">🏠 Client Signup</h1>
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
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Region</option>
            <option value="Hochatown/Broken Bow OK">Hochatown / Broken Bow, OK</option>
            <option value="Hot Springs AR">Hot Springs, AR</option>
            <option value="Grand Lake OK">Grand Lake O' the Cherokees, OK</option>
            <option value="Fayetteville/Bentonville AR">Fayetteville / Bentonville, AR</option>
            <option value="Other">Other (Request a Region)</option>
          </select>

          {form.region === 'Other' && (
            <input
              type="text"
              name="custom_region"
              placeholder="Enter your city or region"
              value={form.custom_region}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          )}

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agree_terms"
              checked={form.agree_terms}
              onChange={handleChange}
              className="h-4 w-4"
              required
            />
            <span className="text-sm">I agree to the TurnReady terms and policies.</span>
          </label>

          <TurnstileWrapper onSuccess={(token) => setCaptchaToken(token)} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {submitting ? 'Submitting...' : '📝 Sign Up as Client'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSignup;
