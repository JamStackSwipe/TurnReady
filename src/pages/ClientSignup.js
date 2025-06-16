// ClientSignup.js
// Allows property owners or managers to sign up as clients. They provide basic info,
// agree to the platform terms, and their profile is saved to Supabase with role='client'.

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ClientSignup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    region: '',
    agree_terms: false,
  });

  const [loading, setLoading] = useState(false);
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

    setLoading(true);

    try {
      const { error } = await supabase.from('profiles').insert([
        {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          region: form.region,
          company: form.company,
          role: 'client',
        },
      ]);

      if (error) throw error;

      toast.success('✅ Signup successful! You may now log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Signup failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-green-700">🏡 Client Signup</h1>
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
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            name="company"
            placeholder="Property Management Company (Optional)"
            value={form.company}
            onChange={handleChange}
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
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agree_terms"
              checked={form.agree_terms}
              onChange={handleChange}
              className="h-4 w-4"
              required
            />
            <span className="text-sm">I agree to the TurnReady service terms and policies.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {loading ? 'Submitting...' : '🎉 Create Client Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSignup;
