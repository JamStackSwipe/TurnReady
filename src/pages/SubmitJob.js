// src/pages/SubmitJob.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SubmitJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('basic');
  const [scheduledDate, setScheduledDate] = useState('');
  const [status, setStatus] = useState('open');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('jobs').insert([
      {
        title,
        description,
        level,
        status,
        scheduled_date: scheduledDate,
        created_by: user?.id || null,
      },
    ]);

    if (error) {
      console.error('Error submitting job:', error.message);
    } else {
      setSuccessMessage('Job submitted successfully!');
      setTitle('');
      setDescription('');
      setLevel('basic');
      setScheduledDate('');
    }

    setSubmitting(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📤 Submit a Job</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <label>
          Job Title:<br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label><br /><br />

        <label>
          Description:<br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label><br /><br />

        <label>
          Skill Level:
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </label><br /><br />

        <label>
          Scheduled Date:<br />
          <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
        </label><br /><br />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Job'}
        </button>
      </form>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default SubmitJob;
