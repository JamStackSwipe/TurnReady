import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SubmitJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 1,
    property_id: '', // Replace with actual property ID once dynamic
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const { error } = await supabase.from('jobs').insert([{
      title: formData.title,
      description: formData.description,
      level: parseInt(formData.level),
      status: 'open',
      property_id: formData.property_id || null,
    }]);

    if (error) {
      console.error(error);
      setStatus('Error creating job.');
    } else {
      setStatus('Job submitted!');
      setFormData({ title: '', description: '', level: 1, property_id: '' });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Submit a Job</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleChange} required />
        <input name="level" type="number" placeholder="Level (1–6)" value={formData.level} onChange={handleChange} min="1" max="6" />
        <input name="property_id" placeholder="Property ID (optional)" value={formData.property_id} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
