// src/pages/TechSignup.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TechSignup = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    region: '',
    shirt_size: '',
    shipping_address: '',
    agree_terms: false,
  });

  const [uploads, setUploads] = useState({
    drivers_license_url: null,
    epa_license_url: null,
    truck_photo_url: null,
    tools_photo_url: null,
    vehicle_insurance_url: null,
    liability_insurance_url: null,
    other_certifications_url: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${key}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('tech-docs')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(`Upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('tech-docs')
      .getPublicUrl(filePath);

    setUploads((prev) => ({
      ...prev,
      [key]: publicUrlData.publicUrl,
    }));

    toast.success(`${key.replace(/_/g, ' ')} uploaded`);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const updates = {
      ...formData,
      ...uploads,
      onboarding_complete: true,
      updated_at: new Date(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast.error('❌ Error submitting tech profile');
    } else {
      toast.success('✅ Profile submitted!');
      navigate('/tech-dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">👷 Tech Profile Setup</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="full_name" placeholder="Full Name" className="w-full p-2 border rounded" value={formData.full_name} onChange={handleChange} />
        <input name="phone" placeholder="Phone" className="w-full p-2 border rounded" value={formData.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" className="w-full p-2 border rounded" value={formData.address} onChange={handleChange} />
        <input name="region" placeholder="Service Region" className="w-full p-2 border rounded" value={formData.region} onChange={handleChange} />
        <input name="shirt_size" placeholder="Shirt Size" className="w-full p-2 border rounded" value={formData.shirt_size} onChange={handleChange} />
        <input name="shipping_address" placeholder="Shipping Address" className="w-full p-2 border rounded" value={formData.shipping_address} onChange={handleChange} />

        {/* Required Uploads */}
        <div>
          <label className="block font-semibold">Driver's License</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'drivers_license_url')} />
        </div>
        <div>
          <label className="block font-semibold">EPA License</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'epa_license_url')} />
        </div>
        <div>
          <label className="block font-semibold">Truck Photo</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'truck_photo_url')} />
        </div>
        <div>
          <label className="block font-semibold">Tools Photo</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'tools_photo_url')} />
        </div>

        {/* Optional Uploads */}
        <div>
          <label className="block font-semibold">Auto Insurance</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'vehicle_insurance_url')} />
        </div>
        <div>
          <label className="block font-semibold">General Liability Insurance</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'liability_insurance_url')} />
        </div>
        <div>
          <label className="block font-semibold">Other Certifications</label>
          <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'other_certifications_url')} />
        </div>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="agree_terms" checked={formData.agree_terms} onChange={handleChange} />
          <span>I agree to the platform terms and conditions.</span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : '✅ Submit Tech Profile'}
        </button>
      </form>
    </div>
  );
};

export default TechSignup;
