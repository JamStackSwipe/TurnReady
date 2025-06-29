// src/pages/TechSignup.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const TechSignup = () => {
  const { user } = useUser();
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
  });

  const [files, setFiles] = useState({
    drivers_license: null,
    auto_insurance: null,
    epa_license: null,
    truck_photo: null,
    tools_photo: null,
    liability_insurance: null,
    other_certifications: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    setFiles(prev => ({ ...prev, [name]: selected[0] }));
  };

  const uploadFile = async (label, file) => {
    const path = `tech-docs/${user.id}/${label}-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('tech-docs').upload(path, file);
    if (error) throw new Error(`Failed to upload ${label}`);
    const { data } = supabase.storage.from('tech-docs').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const required = ['drivers_license', 'auto_insurance', 'epa_license', 'truck_photo', 'tools_photo'];
    for (const key of required) {
      if (!files[key]) {
        toast.error(`❌ Missing required file: ${key.replace('_', ' ')}`);
        return;
      }
    }

    setUploading(true);
    try {
      const uploads = {};
      for (const key in files) {
        if (files[key]) {
          uploads[key] = await uploadFile(key, files[key]);
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          address: `${form.address_street}, ${form.address_city}, ${form.address_state} ${form.address_zip}`,
          drivers_license_url: uploads.drivers_license,
          auto_insurance_url: uploads.auto_insurance,
          epa_license_url: uploads.epa_license,
          truck_photo_url: uploads.truck_photo,
          tools_photo_url: uploads.tools_photo,
          liability_insurance_url: uploads.liability_insurance || null,
          other_certifications_url: uploads.other_certifications || null,
          role: 'tech',
          onboarding_complete: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('✅ Tech profile submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Error submitting tech profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🛠️ Technician Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Info */}
        <input type="text" name="full_name" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="address_street" placeholder="Street or PO Box" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="address_city" placeholder="City" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="address_state" placeholder="State (e.g., TX)" className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="text" name="address_zip" placeholder="ZIP Code" className="w-full p-2 border rounded" onChange={handleChange} required />

        {/* File Uploads */}
        <label>📸 Driver's License (Required)
          <input type="file" name="drivers_license" accept="image/*" onChange={handleFileChange} required className="w-full mt-1" />
        </label>
        <label>📸 Auto Insurance (Required)
          <input type="file" name="auto_insurance" accept="image/*" onChange={handleFileChange} required className="w-full mt-1" />
        </label>
        <label>📸 EPA License (Required)
          <input type="file" name="epa_license" accept="image/*" onChange={handleFileChange} required className="w-full mt-1" />
        </label>
        <label>📸 Truck Photo (Required)
          <input type="file" name="truck_photo" accept="image/*" onChange={handleFileChange} required className="w-full mt-1" />
        </label>
        <label>📸 Tools Photo (Required)
          <input type="file" name="tools_photo" accept="image/*" onChange={handleFileChange} required className="w-full mt-1" />
        </label>

        {/* Optional Uploads */}
        <label>📎 General Liability Insurance (Optional)
          <input type="file" name="liability_insurance" accept="image/*" onChange={handleFileChange} className="w-full mt-1" />
        </label>
        <label>📎 Other Certifications (Optional)
          <input type="file" name="other_certifications" accept="image/*" onChange={handleFileChange} className="w-full mt-1" />
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          {uploading ? 'Uploading...' : '🚀 Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default TechSignup;
