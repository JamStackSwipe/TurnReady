// src/pages/TechProfileSetup.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const TechProfileSetup = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    shirt_size: '',
    shipping_address: '',
    agree_terms: false,
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const [form, setForm] = useState({
  full_name: '',
  phone: '',
  email: '',
  shirt_size: '',
  region: '', // ✅ add this
  // ... rest
});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree_terms || !licenseFile || !insuranceFile) {
      toast.error('Please complete all fields and agree to the terms.');
      return;
    }

    try {
      setUploading(true);

      // Upload license
      const { data: licenseUpload, error: licenseError } = await supabase.storage
        .from('tech-docs')
        .upload(`licenses/${user.id}.jpg`, licenseFile, { upsert: true });

      if (licenseError) throw licenseError;

      // Upload insurance
      const { data: insuranceUpload, error: insuranceError } = await supabase.storage
        .from('tech-docs')
        .upload(`insurance/${user.id}.jpg`, insuranceFile, { upsert: true });

      if (insuranceError) throw insuranceError;

      // Insert profile record
      const { error: insertError } = await supabase.from('tech_profiles').upsert({
        user_id: user.id,
        shirt_size: formData.shirt_size,
        shipping_address: formData.shipping_address,
        license_path: licenseUpload.path,
        insurance_path: insuranceUpload.path,
        status: 'pending',
      });

      if (insertError) throw insertError;

      toast.success('Profile submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error uploading documents or saving profile.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">👷 Tech Profile Setup</h1>

    <label className="block mb-2 text-sm font-medium text-gray-700">Service Region</label>
<select
  name="region"
  value={form.region}
  onChange={handleChange}
  required
  className="w-full border p-2 rounded mb-4"
>
  <option value="">Select Region</option>
  <option value="Hochatown/Broken Bow OK">Hochatown / Broken Bow, OK</option>
  <option value="Hot Springs AR">Hot Springs, AR</option>
  <option value="Ozark Mtns / Branson MO">Ozark Mountains / Branson, MO</option>
  <option value="Grand Lake OK">Grand Lake O' the Cherokees, OK</option>
  <option value="Fayetteville/Bentonville AR">Fayetteville / Bentonville, AR</option>
</select>


      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Shirt Size:
          <select
            name="shirt_size"
            value={formData.shirt_size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </label>

        <label className="block">
          Shipping Address:
          <textarea
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="block">
          Upload Driver’s License:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLicenseFile(e.target.files[0])}
            required
          />
        </label>

        <label className="block">
          Upload Proof of Insurance:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setInsuranceFile(e.target.files[0])}
            required
          />
        </label>

        <label className="block">
          <input
            type="checkbox"
            name="agree_terms"
            checked={formData.agree_terms}
            onChange={handleChange}
            className="mr-2"
            required
          />
          I agree to the background check and onboarding terms.
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? 'Submitting...' : 'Submit Profile'}
        </button>

        <button
          type="button"
          className="bg-gray-400 text-white p-2 rounded w-full mt-4"
          disabled
        >
          Pay $99 Onboarding Fee (Coming Soon)
        </button>
      </form>
    </div>
  );
};

export default TechProfileSetup;
