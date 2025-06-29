// src/pages/TechProfileSetup.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const TechProfileSetup = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    shirt_size: '',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    agree_terms: false,
  });

  const [uploads, setUploads] = useState({
    drivers_license: null,
    auto_insurance: null,
    liability_insurance: null,
    epa_license: null,
    other_certifications: null,
    tool_photo: null,
    vehicle_photo: null,
  });

  const [uploading, setUploading] = useState(false);

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
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);

    try {
      const fileUrls = {};

      for (const key in uploads) {
        const file = uploads[key];
        if (file) {
          const path = `tech-setup/${user.id}/${key}-${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('tech-docs')
            .upload(path, file);
          if (uploadError) throw uploadError;

          const { publicUrl } = supabase.storage
            .from('tech-docs')
            .getPublicUrl(path).data;

          fileUrls[key] = publicUrl;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          shirt_size: formData.shirt_size,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          agree_terms: formData.agree_terms,
          drivers_license_url: fileUrls.drivers_license,
          auto_insurance_url: fileUrls.auto_insurance,
          liability_insurance_url: fileUrls.liability_insurance,
          epa_license_url: fileUrls.epa_license,
          other_certifications_url: fileUrls.other_certifications,
          tool_photo_url: fileUrls.tool_photo,
          vehicle_photo_url: fileUrls.vehicle_photo,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('✅ Profile setup completed!');
    } catch (err) {
      console.error(err);
      toast.error('❌ Error submitting profile setup.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">🔧 Tech Profile Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="font-medium">Shirt Size</label>
          <select
            name="shirt_size"
            value={formData.shirt_size}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
            required
          >
            <option value="">Select...</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Street Address or PO Box</label>
          <input
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            type="text"
            className="w-full mt-1 p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-medium">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              type="text"
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="font-medium">State</label>
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              type="text"
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="font-medium">ZIP Code</label>
            <input
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              type="text"
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileInput label="Driver's License (state valid)" name="drivers_license" onChange={handleFileChange} />
          <FileInput label="Automobile Insurance" name="auto_insurance" onChange={handleFileChange} />
          <FileInput label="General Liability Insurance" name="liability_insurance" onChange={handleFileChange} />
          <FileInput label="EPA License" name="epa_license" onChange={handleFileChange} />
          <FileInput label="Other Certifications (NATE, Boiler, etc.)" name="other_certifications" onChange={handleFileChange} />
          <FileInput label="Photo of Tools" name="tool_photo" onChange={handleFileChange} />
          <FileInput label="Photo of Vehicle" name="vehicle_photo" onChange={handleFileChange} />
        </div>

        <label className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            name="agree_terms"
            checked={formData.agree_terms}
            onChange={handleChange}
            required
          />
          <span>I agree to the Terms of Service and confirm the above is accurate.</span>
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {uploading ? 'Submitting...' : '✅ Submit Profile'}
        </button>
      </form>
    </div>
  );
};

const FileInput = ({ label, name, onChange }) => (
  <label className="block">
    <span className="font-medium">{label}</span>
    <input
      type="file"
      name={name}
      accept="image/*,.pdf"
      onChange={onChange}
      className="w-full mt-1"
      required
    />
  </label>
);

export default TechProfileSetup;
