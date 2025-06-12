// src/pages/ClientDashboard.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ClientDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClientJobs() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.warn('No user session found.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching client jobs:', error.message);
      } else {
        setJobs(data);
      }

      setLoading(false);
    }

    fetchClientJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👤 Client Dashboard</h1>

      {loading ? (
        <p>Loading your jobs...</p>
      ) : jobs.length > 0 ? (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <strong>{job.title}</strong><br />
              Status: {job.status}<br />
              Level: {job.level}<br />
              Scheduled: {job.scheduled_date || 'TBD'}<br />
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't submitted any jobs yet.</p>
      )}
    </div>
  );
};

export default ClientDashboard;
