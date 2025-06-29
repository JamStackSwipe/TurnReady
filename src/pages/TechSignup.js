// src/pages/TechSignup.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const TechSignup = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    region: '',
    address: '',
    agree_terms: false,
  });

  const [uploads, setUploads] = useState({
    vehicle_insurance_url: null,
    liability_insurance_url: null,
    epa_license_url: null,
    truck_photo_url: null,
    tool_photo_url: null,
    other_certifications_url: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUploads((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const uploadFile = async (file, pathPrefix) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}/${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('documents').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree_terms) {
      toast.error('You must agree to the terms.');
      return;
    }

    try {
      setUploading(true);

      // Upload all files
      const uploadedUrls = {};
      for (const [key, file] of Object.entries(uploads)) {
        if (file) {
          const url = await uploadFile(file, `tech_docs/${user.id}/${key}`);
          uploadedUrls[key] = url;
        }
      }

      const update = {
        ...formData,
        ...uploadedUrls,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(update)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Tech profile submitted!');
      navigate('/tech-dashboard');
    } catch (err) {
      console.error('Error submitting tech profile:', err);
      toast.error('❌ Error submitting tech profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tech Profile Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="full_name" placeholder="Full Name" className="w-full p-2 border rounded" value={formData.full_name} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" className="w-full p-2 border rounded" value={formData.phone} onChange={handleChange} />
        <input type="text" name="region" placeholder="Service Region" className="w-full p-2 border rounded" value={formData.region} onChange={handleChange} />
        <input type="text" name="address" placeholder="Mailing Address" className="w-full p-2 border rounded" value={formData.address} onChange={handleChange} />

        {/* Uploads */}
        <label className="block mt-4">Driver's License / EPA License (PDF or image)</label>
        <input type="file" name="epa_license_url" onChange={handleFileChange} />

        <label className="block mt-4">Auto Insurance</label>
        <input type="file" name="vehicle_insurance_url" onChange={handleFileChange} />

        <label className="block mt-4">Liability Insurance</label>
        <input type="file" name="liability_insurance_url" onChange={handleFileChange} />

        <label className="block mt-4">Truck Photo</label>
        <input type="file" name="truck_photo_url" onChange={handleFileChange} />

        <label className="block mt-4">Tool Photo</label>
        <input type="file" name="tool_photo_url" onChange={handleFileChange} />

        <label className="block mt-4">Other Certifications</label>
        <input type="file" name="other_certifications_url" onChange={handleFileChange} />

        <label className="flex items-center mt-4">
          <input type="checkbox" name="agree_terms" checked={formData.agree_terms} onChange={handleChange} className="mr-2" />
          I agree to the terms and conditions.
        </label>

        <button type="submit" disabled={uploading} className="bg-blue-600 text-white py-2 px-4 rounded w-full mt-4">
          {uploading ? 'Submitting...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default TechSignup;
