// src/pages/TechDashboard.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const TechDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpenJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching open jobs:', error.message);
      } else {
        setJobs(data);
      }

      setLoading(false);
    }

    fetchOpenJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛠️ Technician Dashboard</h1>

      {loading ? (
        <p>Loading open jobs...</p>
      ) : jobs.length > 0 ? (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <strong>{job.title}</strong><br />
              Client: {job.client_name || 'Anonymous'}<br />
              Level: {job.level}<br />
              Scheduled: {job.scheduled_date || 'TBD'}<br />
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No open jobs at the moment.</p>
      )}
    </div>
  );
};

export default TechDashboard;
