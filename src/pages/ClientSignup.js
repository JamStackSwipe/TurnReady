// src/pages/ClientSignup.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ClientSignup = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [regionOptions, setRegionOptions] = useState([]);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    region: '',
    custom_region: '',
    agree_terms: false,
  });

  useEffect(() => {
    const loadRegions = async () => {
      const { data, error } = await supabase.from('regions').select('name');
      if (error) {
        console.error('Error loading regions:', error);
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
    if (!user) {
      toast.error('You must be logged in first.');
      return;
    }
    if (!form.agree_terms) {
      toast.error('❌ You must agree to the terms.');
      return;
    }

    const region = form.region === 'Other' ? form.custom_region : form.region;

    const { error } = await supabase.from('client_profiles').insert([
      {
        user_id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        region,
        status: 'active',
      },
    ]);

    if (error) {
      console.error(error);
      toast.error('Failed to submit client profile.');
    } else {
      localStorage.setItem('turnready_role', 'client');
      toast.success('✅ Client profile submitted!');
      navigate('/client-dashboard');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">🏠 Client Profile Setup</h1>
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
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
        <label className="block font-medium">Service Region</label>
        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select a Region</option>
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
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
            required
            className="h-4 w-4"
          />
          <span className="text-sm">I agree to the TurnReady terms and policies.</span>
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default ClientSignup;
