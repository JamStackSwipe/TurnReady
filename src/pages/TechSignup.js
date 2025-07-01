// src/pages/TechSignup.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const TechSignup = () => {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    region: '',
    address: '',
    zip: '',
  });

  const [uploads, setUploads] = useState({
    drivers_license_url: '',
    epa_license_url: '',
    vehicle_insurance_url: '',
    liability_insurance_url: '',
    truck_photo_url: '',
    tool_photo_url: '',
    other_certifications_url: '',
  });

  useEffect(() => {
    const loadRegions = async () => {
      const { data, error } = await supabase.from('regions').select('name');
      if (error) {
        console.error('Failed to load regions:', error);
      } else {
        setRegionOptions(data.map((r) => r.name));
      }
    };
    loadRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${fieldName}.${fileExt}`;

    const { error } = await supabase.storage
      .from('tech-docs')
      .upload(filePath, file, { upsert: true });

    if (error) {
      toast.error(`Failed to upload ${fieldName}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = await supabase
      .storage
      .from('tech-docs')
      .createSignedUrl(filePath, 3600);

    setUploads((prev) => ({
      ...prev,
      [fieldName]: urlData?.signedUrl || '',
    }));

    setUploading(false);
    toast.success(`${fieldName.replaceAll('_', ' ')} uploaded`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const update = {
      ...formData,
      ...uploads,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', user.id);

    if (error) {
      toast.error('Error submitting tech profile');
      console.error(error);
    } else {
      toast.success('Profile submitted successfully');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tech Profile Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <label className="block font-medium mb-1">Service Region</label>
        <select
          name="region"
          value={formData.region}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2"
        >
          <option value="">Select a region</option>
          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="address"
          placeholder="Mailing Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        <input
          type="text"
          name="zip"
          placeholder="Zip Code"
          value={formData.zip}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />

        {/* Upload Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['drivers_license_url', 'Driver’s License'],
            ['epa_license_url', 'EPA License'],
            ['vehicle_insurance_url', 'Vehicle Insurance Policy'],
            ['liability_insurance_url', 'Liability Insurance (optional)'],
            ['truck_photo_url', 'Photo of Truck'],
            ['tool_photo_url', 'Photo of Tools'],
            ['other_certifications_url', 'Other Certifications (optional)'],
          ].map(([field, label]) => (
            <div key={field}>
              <label className="block font-medium">{label}</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, field)}
                className="w-full border px-2 py-1"
              />
              {uploads[field] && (
                <a
                  href={uploads[field]}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  View uploaded file
                </a>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {uploading ? 'Uploading...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default TechSignup;
