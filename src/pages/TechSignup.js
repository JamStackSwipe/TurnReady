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

  const [vehicleInsuranceFile, setVehicleInsuranceFile] = useState(null);
  const [liabilityInsuranceFile, setLiabilityInsuranceFile] = useState(null);
  const [driversLicenseFile, setDriversLicenseFile] = useState(null);
  const [epaLicenseFile, setEpaLicenseFile] = useState(null);
  const [otherCertsFile, setOtherCertsFile] = useState(null);
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

    if (!vehicleInsuranceFile || !liabilityInsuranceFile || !driversLicenseFile) {
      toast.error('❌ Vehicle, liability, and driver’s license are required.');
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
      if (!user) throw new Error('User not returned after signup');

      const timestamp = Date.now();

      const uploadFile = async (file, label) => {
        const path = `tech_docs/${timestamp}_${label}_${file.name}`;
        const { error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true });
        if (error) throw error;
        return path;
      };

      const vehiclePath = await uploadFile(vehicleInsuranceFile, 'vehicle');
      const liabilityPath = await uploadFile(liabilityInsuranceFile, 'liability');
      const driversPath = await uploadFile(driversLicenseFile, 'dl');
      const epaPath = epaLicenseFile ? await uploadFile(epaLicenseFile, 'epa') : null;
      const otherPath = otherCertsFile ? await uploadFile(otherCertsFile, 'other') : null;

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          region: form.region,
          role: 'tech',
          vehicle_insurance_url: vehiclePath,
          liability_insurance_url: liabilityPath,
          drivers_license_url: driversPath,
          epa_license_url: epaPath,
          other_certs_url: otherPath,
        },
      ]);

      if (profileError) {
        console.error(profileError);
        toast.error('Profile insert failed. It may require email verification first.');
      } else {
        toast.success('✅ Signup successful! Check your email to verify your account.');
      }

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

          <input name="full_name" value={form.full_name} onChange={handleChange} required placeholder="Full Name" className="w-full border rounded-lg p-3" />
          <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email" className="w-full border rounded-lg p-3" />
          <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Create a Password" className="w-full border rounded-lg p-3" />
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full border rounded-lg p-3" />

          <select name="region" value={form.region} onChange={handleChange} required className="w-full border rounded-lg p-3">
            <option value="">Select Region</option>
            <option value="Hochatown/Broken Bow OK">Hochatown / Broken Bow, OK</option>
            <option value="Hot Springs AR">Hot Springs, AR</option>
            <option value="Grand Lake OK">Grand Lake O' the Cherokees, OK</option>
            <option value="Fayetteville/Bentonville AR">Fayetteville / Bentonville, AR</option>
            <option value="Other">Other (Request a Region)</option>
          </select>

          {form.region === 'Other' && (
            <input name="custom_region" value={form.custom_region || ''} onChange={(e) => setForm(prev => ({ ...prev, custom_region: e.target.value }))} placeholder="Enter your region" className="w-full border rounded-lg p-3" />
          )}

          <div>
            <label className="block text-sm font-medium">Upload Vehicle Insurance</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setVehicleInsuranceFile(e.target.files[0])} required />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload General Liability Insurance</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setLiabilityInsuranceFile(e.target.files[0])} required />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Driver's License</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setDriversLicenseFile(e.target.files[0])} required />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload EPA License (if applicable)</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setEpaLicenseFile(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-sm font-medium">Other Certifications (optional)</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setOtherCertsFile(e.target.files[0])} />
          </div>

          <label className="flex items-center space-x-2">
            <input type="checkbox" name="agree_terms" checked={form.agree_terms} onChange={handleChange} className="h-4 w-4" required />
            <span className="text-sm">I agree to the TurnReady terms and policies.</span>
          </label>

          <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            {uploading ? 'Submitting...' : '🚀 Sign Up as Tech'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechSignup;
