import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const SubmitJob = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    property_id: '',
    property_name: '',
    job_type: '',
    urgency: '',
    region: '',
    address: '',
    preferred_time: '',
    contact_name: '',
    contact_phone: '',
    special_instructions: '',
    door_code: '', // stored separately
  });

  const [regions, setRegions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        toast.error('User not logged in');
        return;
      }
      setUserId(user.id);

      const [{ data: regionData, error: regionErr }, { data: propData, error: propErr }] = await Promise.all([
        supabase.from('regions').select('name'),
        supabase.from('properties').select('id, name, address').eq('owner_id', user.id),
      ]);

      if (regionErr) console.error('Error loading regions:', regionErr.message);
      else setRegions(regionData.map((r) => r.name));

      if (propErr) console.error('Error loading properties:', propErr.message);
      else setProperties(propData);
    };

    init();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertySelect = (e) => {
    const propertyId = e.target.value;
    const selected = properties.find((p) => p.id === propertyId);

    setForm((prev) => ({
      ...prev,
      property_id: propertyId,
      property_name: selected?.name || '',
      address: selected?.address || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobPayload = { ...form };
    const doorCode = jobPayload.door_code;
    delete jobPayload.door_code;

    const { data: job, error } = await supabase
      .from('job_submissions')
      .insert([jobPayload])
      .select()
      .single();

    if (error) {
      toast.error('Failed to submit job');
      console.error(error);
    } else {
      if (doorCode && job?.id) {
        const { error: doorError } = await supabase
          .from('job_secure_data')
          .insert([{ job_id: job.id, door_code: doorCode }]);
        if (doorError) {
          console.warn('Failed to store door code:', doorError.message);
        }
      }

      toast.success('Job submitted successfully!');
      setForm({
        title: '',
        description: '',
        property_id: '',
        property_name: '',
        job_type: '',
        urgency: '',
        region: '',
        address: '',
        preferred_time: '',
        contact_name: '',
        contact_phone: '',
        special_instructions: '',
        door_code: '',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Submit a Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Property selector */}
        <label className="block font-medium">Select a Saved Property</label>
        <select
          name="property_id"
          value={form.property_id}
          onChange={handlePropertySelect}
          className="w-full border px-4 py-2"
        >
          <option value="">-- Optional: Choose a saved property --</option>
          {properties.map((prop) => (
            <option key={prop.id} value={prop.id}>
              {prop.name} — {prop.address}
            </option>
          ))}
        </select>

        {/* Manual fallback fields */}
        <input
          type="text"
          name="property_name"
          placeholder="Property Name"
          value={form.property_name}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Property Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />

        {/* Job info */}
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <select
          name="job_type"
          value={form.job_type}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        >
          <option value="">Select Job Type</option>
          <option value="HVAC">HVAC</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Handyman">Handyman</option>
        </select>
        <select
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        >
          <option value="">Select Urgency</option>
          <option value="Emergency">Emergency</option>
          <option value="Same Day">Same Day</option>
          <option value="Routine">Routine</option>
        </select>

        {/* Region */}
        <label className="block font-medium">Service Region</label>
        <select
          name="region"
          value={form.region}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        >
          <option value="">Select a region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        {/* Time + contact */}
        <input
          type="text"
          name="preferred_time"
          placeholder="Preferred Time (e.g. 2–4 PM)"
          value={form.preferred_time}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        <input
          type="text"
          name="contact_name"
          placeholder="Contact Name"
          value={form.contact_name}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <input
          type="text"
          name="contact_phone"
          placeholder="Contact Phone"
          value={form.contact_phone}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />

        {/* Other notes */}
        <textarea
          name="special_instructions"
          placeholder="Special Instructions (gate code, dogs, etc.)"
          value={form.special_instructions}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        <input
          type="text"
          name="door_code"
          placeholder="Door Code (visible only to assigned tech)"
          value={form.door_code}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Submit Job
        </button>
      </form>
    </div>
  );
};

export default SubmitJob;
