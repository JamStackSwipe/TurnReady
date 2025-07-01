// src/pages/SubmitJob.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const SubmitJob = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    region: '',
    address: '',
    contact_name: '',
    contact_phone: '',
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

    const { error } = await supabase.from('job_submissions').insert([form]);

    if (error) {
      toast.error('Failed to submit job');
      console.error(error);
    } else {
      toast.success('Job submitted!');
      setForm({
        title: '',
        description: '',
        region: '',
        address: '',
        contact_name: '',
        contact_phone: '',
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
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2"
          required
        />
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
        />
        <input
          type="text"
          name="contact_name"
          placeholder="Contact Name"
          value={form.contact_name}
          onChange={handleChange}
          className="w-full border px-4 py-2"
        />
        <input
          type="text"
          name="contact_phone"
          placeholder="Contact Phone"
          value={form.contact_phone}
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
