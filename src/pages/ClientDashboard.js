// src/pages/ClientSignup.js

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ClientSignup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    region: '',
    agree_terms: false,
  });

  const [ownershipProofFile, setOwnershipProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
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

    setUploading(true);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) throw signUpError;
      const user = authData.user;
      if (!user) throw new Error('User not returned after signup.');

      let ownershipProofPath = null;
      if (ownershipProofFile) {
        const timestamp = Date.now();
        const path = `client_docs/${timestamp}_ownership_${ownershipProofFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(path, ownershipProofFile, { upsert: true });
        if (uploadError) throw uploadError;
        ownershipProofPath = path;
      }

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          region: form.region === 'Other' ? form.custom_region : form.region,
          role: 'client',
          ownership_proof_url: ownershipProofPath,
        },
      ]);

      if (profileError) throw profileError;

      toast.success('✅ Signup successful! Check your email to confirm your account.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(`Signup failed: ${err.message}`);
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-2xl">
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
              value={form.custom_region || ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, custom_region: e.target.value }))
              }
              className="w-full border rounded-lg p-3"
            />
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Ownership Proof (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setOwnershipProofFile(e.target.files[0])}
            />
          </div>

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
            disabled={uploading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {uploading ? 'Submitting...' : '📝 Sign Up as Client'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSignup;
