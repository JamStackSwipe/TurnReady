// src/components/SubmitJob.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

export default function SubmitJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: '',
    status: 'submitted',
    property_name: '',
    address: '',
    phone: '',
    email: '',
    property_manager: '',
    owner_name: '',
    guest_present: 'no',
    next_check_in: '',
    requested_time: 'next_available',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('jobs').insert([formData]);

    if (error) {
      console.error(error.message);
      toast.error('Failed to submit job.');
    } else {
      toast.success('Job submitted successfully!');
      setFormData({
        title: '',
        description: '',
        level: '',
        status: 'submitted',
        property_name: '',
        address: '',
        phone: '',
        email: '',
        property_manager: '',
        owner_name: '',
        guest_present: 'no',
        next_check_in: '',
        requested_time: 'next_available',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Submit Service Request</h2>

      <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Problem Description" required />

      <select name="level" value={formData.level} onChange={handleChange} required>
        <option value="">Select Difficulty Level</option>
        <option value="basic">Basic</option>
        <option value="intermediate">Intermediate</option>
        <option value="urgent">Urgent</option>
      </select>

      <input name="property_name" value={formData.property_name} onChange={handleChange} placeholder="Cabin / Property Name" required />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Property Address" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
      <input name="property_manager" value={formData.property_manager} onChange={handleChange} placeholder="Property Management Company" required />
      <input name="owner_name" value={formData.owner_name} onChange={handleChange} placeholder="Owner's Name (for Warranty)" required />

      <label>
        Guest Present?
        <select name="guest_present" value={formData.guest_present} onChange={handleChange}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </label>

      <label>
        Next Check-In Date
        <input name="next_check_in" type="date" value={formData.next_check_in} onChange={handleChange} />
      </label>

      <label>
        Requested Service Time
        <select name="requested_time" value={formData.requested_time} onChange={handleChange}>
          <option value="next_available">Next Available</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="asap">ASAP (Emergency)</option>
        </select>
      </label>

      <button type="submit">Submit Job</button>
    </form>
  );
}
