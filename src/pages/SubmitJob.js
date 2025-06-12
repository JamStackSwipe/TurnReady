// src/pages/SubmitJob.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const SubmitJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('basic');
  const [scheduledDate, setScheduledDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.from('jobs').insert([
      {
        title,
        description,
        level,
        scheduled_date: scheduledDate,
        status: 'open', // Default status for new jobs
      },
    ]);

    if (error) {
      console.error('Error submitting job:', error.message);
      setMessage('❌ Failed to submit job.');
    } else {
      setMessage('✅ Job submitted successfully!');
      setTitle('');
      setDescription('');
      setLevel('basic');
      setScheduledDate('');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📤 Submit a New Job</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div>
          <label>Title:</label><br />
          <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%' }} />
        </div>

        <div>
          <label>Description:</label><br />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} style={{ width: '100%' }} />
        </div>

        <div>
          <label>Skill Level:</label><br />
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="basic">Basic</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label>Scheduled Date:</label><br />
          <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>Submit Job</button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default SubmitJob;
