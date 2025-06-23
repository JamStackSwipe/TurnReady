// src/pages/TechSignup.js

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TechSignup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    region: '',
    agree_terms: false,
  });

  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [epaLicenseFile, setEpaLicenseFile] = useState(null);
  const [otherCertFile, setOtherCertFile] = useState(null);
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

    if (!driverLicenseFile) {
      toast.error('❌ Driver’s license is required.');
      return;
    }

    setUploading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) throw signUpError;
      const user = authData.user;
      if (!user) throw new Error('User not returned after sign up.');

      const timestamp = Date.now();
      const uploads = [];

      // 2. Upload driver license (required)
      const driverPath = `tech_docs/${timestamp}_driver_${driverLicenseFile.name}`;
      await supabase.storage.from('uploads').upload(driverPath, driverLicenseFile, { upsert: true });
      uploads.push({ key: 'driver_license_url', path: driverPath });

      // 3. Upload optional EPA license
      if (epaLicenseFile) {
        const epaPath = `tech_docs/${timestamp}_epa_${epaLicenseFile.name}`;
        await supabase.storage.from('uploads').upload(epaPath, epaLicenseFile, { upsert: true });
        uploads.push({ key: 'epa_license_url', path: epaPath });
      }

      // 4. Upload optional Other certs
      if (otherCertFile) {
        const otherPath = `tech_docs/${timestamp}_other_${otherCertFile.name}`;
        await supabase.storage.from('uploads').upload(otherPath, otherCertFile, { upsert: true });
        uploads.push({ key: 'other_cert_url', path: otherPath });
      }

      // 5. Insert profile (after sign-up)
      const profileInsert = {
        id: user.id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        region: form.region,
        role: 'tech',
      };

      uploads.forEach(({ key, path }) => {
        profileInsert[key] = path;
      });

      const { error: profileError } = await supabase.from('profiles').insert([profileInsert]);
      if (profileError) throw profileError;

      toast.success('✅ Signup successful! Please check your email to confirm.');
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
        <h1 className="text-2xl font-bold mb-6 text-blue-700">🛠️ Technician Signup</h1>
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
            <label className="block text-sm font-medium">Upload Driver’s License (Required)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setDriverLicenseFile(e.target.files[0])}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload EPA License (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setEpaLicenseFile(e.target.files[0])}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Other Certifications (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setOtherCertFile(e.target.files[0])}
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {uploading ? 'Submitting...' : '🚀 Sign Up as Tech'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechSignup;
