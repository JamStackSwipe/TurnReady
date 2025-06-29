// src/pages/TechSignup.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const TechSignup = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  const [uploads, setUploads] = useState({
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUploads((prev) => ({ ...prev, [name]: files[0] }));
  };

  const uploadFile = async (file, path) => {
    const { data, error } = await supabase.storage
      .from('tech-docs')
      .upload(`${user.id}/${path}`, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    try {
      const uploadedPaths = {};

      for (const [key, file] of Object.entries(uploads)) {
        if (file) {
          const path = await uploadFile(file, key);
          uploadedPaths[key] = path;
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          onboarding_complete: true,
          ...uploadedPaths,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('✅ Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🛠️ Tech Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="space-y-4">
          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          />
          <input
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          />
        </div>

        {/* Required Uploads */}
        <div className="space-y-4">
          <label className="block">
            Driver’s License (Required)
            <input
              type="file"
              name="drivers_license"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              required
            />
          </label>

          <label className="block">
            Auto Insurance (Required)
            <input
              type="file"
              name="auto_insurance"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              required
            />
          </label>

          <label className="block">
            EPA License (Required)
            <input
              type="file"
              name="epa_license"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              required
            />
          </label>

          <label className="block">
            Truck Photo (Required)
            <input
              type="file"
              name="truck_photo"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              required
            />
          </label>

          <label className="block">
            Tools Photo (Required)
            <input
              type="file"
              name="tools_photo"
              onChange={handleFileChange}
              className="mt-1 block w-full"
              required
            />
          </label>
        </div>

        {/* Optional Uploads */}
        <div className="space-y-4 pt-4 border-t">
          <label className="block">
            General Liability Insurance (Optional)
            <input
              type="file"
              name="liability_insurance"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </label>

          <label className="block">
            Other Certifications (Optional)
            <input
              type="file"
              name="other_certifications"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
        >
          {uploading ? 'Uploading...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default TechSignup;
