import React, { useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ClientSignup = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '',
    email: user?.email || '',
    phone: '',
    region: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.phone || !form.region) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Insert into client_profiles
      const { error: clientError } = await supabase.from('client_profiles').upsert({
        user_id: user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        region: form.region,
        status: 'active',
        role: 'client',
      });

      if (clientError) throw clientError;

      // 2️⃣ Upsert into profiles (for session + AuthProvider detection)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        role: 'client',
        region: form.region,
        onboarding_complete: true,
      });

      if (profileError) throw profileError;

      toast.success('✅ Client profile created successfully!');
      navigate('/client-dashboard');

    } catch (err) {
      console.error('ClientSignup error:', err.message);
      toast.error(`Signup failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">🏡 Complete Client Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full border rounded-lg p-3 bg-gray-100 text-gray-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">Select Your Region</option>
            <option value="Broken Bow">Broken Bow</option>
            <option value="Hot Springs">Hot Springs</option>
            <option value="Other">Other</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSignup;
