// src/pages/SubmitJob.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../supabaseClient';

const SubmitJob = () => {
  const [form, setForm] = useState({
    region: '',
    propertyName: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    propertyManagementCompany: '',
    ownerName: '',
    description: '',
    guestPresent: false,
    nextCheckIn: '',
    serviceRequestedBy: '',
    emergency: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate backend submission
    toast.success('✅ Job submitted successfully!');

    // TODO: Submit to Supabase (if needed)
    // await supabase.from('job_submissions').insert([{ ...form }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">📤 Submit a New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Region</label>
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

          <input
            type="text"
            name="propertyName"
            placeholder="Property Name"
            value={form.propertyName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
