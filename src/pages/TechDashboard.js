// src/pages/TechDashboard.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const TechDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .in('status', ['open', 'in progress']) // Filter by status
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tech jobs:', error.message);
      } else {
        setJobs(data);
      }

      setLoading(false);
    }

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛠 Tech Dashboard</h1>
      {loading ? (
        <p>Loading jobs for techs...</p>
      ) : jobs.length === 0 ? (
        <p>No active jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li
              key={job.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #aaa',
                borderRadius: '8px',
              }}
            >
              <strong>{job.title}</strong> — {job.status}<br />
              🧰 Level: {job.level}<br />
              📅 Scheduled: {job.scheduled_date || 'TBD'}<br />
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TechDashboard;
