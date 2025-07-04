import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ClientSignup = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [regionOptions, setRegionOptions] = useState([]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    region: '',
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const clientProfile = {
      user_id: user.id,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      region: formData.region,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    const profileUpdate = {
      full_name: formData.full_name,
      phone: formData.phone,
      region: formData.region,
      role: 'client',
      updated_at: new Date().toISOString(),
    };

    try {
      const { error: clientError } = await supabase
        .from('client_profiles')
        .insert(clientProfile);

      if (clientError) throw clientError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('✅ Client profile completed!');
      localStorage.setItem('turnready_role', 'client');
      navigate('/client-dashboard');
    } catch (error) {
      console.error(error);
      toast.error(`Error completing profile: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🏠 Complete Your Client Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2"
        />
        <label className="block font-medium mb-1">Select Region</label>
        <select
          name="region"
          value={formData.region}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2"
        >
          <option value="">Select Region</option>
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          ✅ Submit Client Profile
        </button>
      </form>
    </div>
  );
};

export default ClientSignup;
