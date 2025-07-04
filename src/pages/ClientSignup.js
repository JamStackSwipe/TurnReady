import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClientSignup = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [regionOptions, setRegionOptions] = useState([]);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    region: [],
    address: '',
    zip: '',
  });

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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setForm((prev) => ({ ...prev, region: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const update = {
      ...form,
      onboarding_complete: true,
      role: 'client',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', user.id);

    if (error) {
      toast.error('Error submitting client profile');
      console.error(error);
    } else {
      toast.success('Profile submitted successfully');
      navigate('/client-dashboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🏡 Client Profile Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <label className="block font-medium mb-1">Select Service Regions</label>
        <select
          name="region"
          multiple
          value={form.region}
          onChange={handleRegionChange}
          className="w-full border px-4 py-2 h-40"
        >
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="address"
          placeholder="Mailing Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        <input
          type="text"
          name="zip"
          placeholder="Zip Code"
          value={form.zip}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default ClientSignup;
