// TechSignup.js
// This page allows technicians to sign up by providing basic info, uploading insurance/license files,
// and agreeing to the platform terms. Techs are saved to the 'profiles' table with role='tech'.

import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TechSignup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    region: '',
    agree_terms: false,
  });

  const [insuranceFile, setInsuranceFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
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
      toast.error('❌ You must agree to the terms to continue.');
      return;
    }

    if (!insuranceFile || !licenseFile) {
      toast.error('❌ Please upload both insurance and license documents.');
      return;
    }

    setUploading(true);

    try {
      // Upload documents to Supabase storage
      const timestamp = Date.now();
      const insurancePath = `tech_docs/${timestamp}_insurance_${insuranceFile.name}`;
      const licensePath = `tech_docs/${timestamp}_license_${licenseFile.name}`;

      const { error: insuranceError } = await supabase.storage
        .from('uploads')
        .upload(insurancePath, insuranceFile);

      const { error: licenseError } = await supabase.storage
        .from('uploads')
        .upload(licensePath, licenseFile);

      if (insuranceError || licenseError) throw new Error('Upload failed');

      // Save tech profile
      const { error } = await supabase.from('profiles').insert([
        {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          region: form.region,
          role: 'tech',
          insurance_url: insurancePath,
          license_url: licensePath,
        },
      ]);

      if (error) throw error;

      toast.success('✅ Signup complete! Await approval.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Signup failed. Please try again.');
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
            <option value="Ozark Mtns / Branson MO">Ozark Mountains / Branson, MO</option>
            <option value="Grand Lake OK">Grand Lake O' the Cherokees, OK</option>
            <option value="Fayetteville/Bentonville AR">Fayetteville / Bentonville, AR</option>
          </select>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Insurance Document</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setInsuranceFile(e.target.files[0])}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload License Document</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setLicenseFile(e.target.files[0])}
              required
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
