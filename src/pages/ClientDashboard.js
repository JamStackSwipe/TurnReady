// src/pages/ClientDashboard.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ClientDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading jobs:', error.message);
      } else {
        setJobs(data);
      }

      setLoading(false);
    }

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📋 Client Dashboard</h1>
      {loading ? (
        <p>Loading your jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li
              key={job.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <strong>{job.title}</strong> — {job.status}<br />
              📅 {job.scheduled_date || 'TBD'}<br />
              🛠 Level: {job.level}<br />
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientDashboard;
