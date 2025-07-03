// src/pages/ClientSignup.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../components/AuthProvider';

const ClientSignup = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [regionOptions, setRegionOptions] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    region: '',
    agree_terms: false,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadRegions = async () => {
      const { data, error } = await supabase.from('regions').select('name');
      if (error) {
        console.error('Failed to load regions:', error);
      } else {
        setRegionOptions(data.map((r) => r.name));
      }
    };
    loadRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!form.agree_terms) {
      toast.error('❌ You must agree to the terms.');
      return;
    }

    setSubmitting(true);

    const payload = {
      user_id: user.id,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      region: form.region,
      status: 'active',
    };

    const { error } = await supabase.from('client_profiles').insert([payload]);

    if (error) {
      console.error(error);
      toast.error('Signup failed: ' + error.message);
    } else {
      localStorage.setItem('turnready_role', 'client');
      toast.success('✅ Signup complete!');
      navigate('/client-dashboard');
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
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <label className="block font-medium">Select Your Region</label>
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          >
            <option value="">Choose a region</option>
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
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
            <span className="text-sm">I agree to the TurnReady terms and policies.</span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {submitting ? 'Submitting...' : '📝 Complete Client Signup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSignup;
