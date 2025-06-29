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
    zip: '',
    region: '',
  });

  const [uploads, setUploads] = useState({
    driverLicense: null,
    epaLicense: null,
    liabilityInsurance: null,
    otherCerts: null,
    truckPhoto: null,
    toolPhoto: null,
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
    if (!file) return null;
    const { data, error } = await supabase.storage
      .from('tech-docs')
      .upload(`${user.id}/${path}`, file, { upsert: true });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage
      .from('tech-docs')
      .getPublicUrl(`${user.id}/${path}`);
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Not logged in');
    setUploading(true);

    try {
      const driverUrl = await uploadFile(uploads.driverLicense, 'driver_license');
      const epaUrl = await uploadFile(uploads.epaLicense, 'epa_license');
      const liabilityUrl = await uploadFile(uploads.liabilityInsurance, 'liability');
      const otherUrl = await uploadFile(uploads.otherCerts, 'other_certs');
      const truckUrl = await uploadFile(uploads.truckPhoto, 'truck_photo');
      const toolUrl = await uploadFile(uploads.toolPhoto, 'tool_photo');

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        address: `${formData.address}, ${formData.zip}`,
        region: formData.region,
        vehicle_insurance_url: null,
        liability_insurance_url: liabilityUrl,
        epa_license_url: epaUrl,
        other_certifications_url: otherUrl,
        truck_photo_url: truckUrl,
        tool_photo_url: toolUrl,
        onboarding_complete: true,
      });

      if (error) {
        console.error(error);
        toast.error('Error submitting tech profile');
      } else {
        toast.success('Profile submitted!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Technician Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} className="w-full border p-2" required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border p-2" required />
        <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} className="w-full border p-2" required />
        <input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} className="w-full border p-2" required />
        <input type="text" name="region" placeholder="Service Region (e.g. Broken Bow)" value={formData.region} onChange={handleChange} className="w-full border p-2" required />

        <div className="border-t pt-4">
          <label className="block mb-1 font-medium">Driver’s License (Required)</label>
          <input type="file" name="driverLicense" onChange={handleFileChange} accept="image/*,.pdf" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">EPA License (Required)</label>
          <input type="file" name="epaLicense" onChange={handleFileChange} accept="image/*,.pdf" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Truck Photo (Required)</label>
          <input type="file" name="truckPhoto" onChange={handleFileChange} accept="image/*" required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tool Photo (Required)</label>
          <input type="file" name="toolPhoto" onChange={handleFileChange} accept="image/*" required />
        </div>

        <div>
          <label className="block mb-1">General Liability Insurance (Optional)</label>
          <input type="file" name="liabilityInsurance" onChange={handleFileChange} accept="image/*,.pdf" />
        </div>

        <div>
          <label className="block mb-1">Other Certifications (Optional)</label>
          <input type="file" name="otherCerts" onChange={handleFileChange} accept="image/*,.pdf" />
        </div>

        <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {uploading ? 'Submitting...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default TechSignup;
