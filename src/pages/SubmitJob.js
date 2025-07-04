import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const SubmitJob = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    property_name: '',
    job_type: '',
    urgency: '',
    region: '',
    address: '',
    preferred_time: '',
    contact_name: '',
    contact_phone: '',
    special_instructions: '',
    door_code: '', // Stored separately
  });

  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const loadRegions = async () => {
      const { data, error } = await supabase.from('regions').select('name');
      if (error) {
        console.error('Failed to load regions:', error);
      } else {
        setRegions(data.map(r => r.name));
      }
    };
    loadRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jobPayload = { ...form };
    const doorCode = jobPayload.door_code;
    delete jobPayload.door_code; // Don't store directly in jobs table

    const { data, error } = await supabase
      .from('job_submissions')
      .insert([jobPayload])
      .select()
      .single();

    if (error) {
      toast.error('Failed to submit job');
      console.error(error);
    } else {
      // Store door code securely (placeholder logic)
      if (doorCode && data?.id) {
        const { error: codeError } = await supabase
          .from('job_secure_data')
          .insert([{ job_id: data.id, door_code: doorCode }]);

        if (codeError) {
          console.warn('Failed to store door code securely', codeError);
        }
      }

      toast.success('Job submitted!');
      setForm({
        title: '',
        description: '',
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
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <input
          type="text"
          name="property_name"
          placeholder="Property Name"
          value={form.property_name}
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
        <input
          type="text"
          name="address"
          placeholder="Property Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
        <input
          type="text"
          name="preferred_time"
          placeholder="Preferred Time Window (e.g. 2–4 PM)"
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
        <textarea
          name="special_instructions"
          placeholder="Special Instructions (dogs, guests, gate code, etc.)"
          value={form.special_instructions}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        <input
          type="text"
          name="door_code"
          placeholder="Door Code (will only be shown to assigned tech)"
          value={form.door_code}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
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
