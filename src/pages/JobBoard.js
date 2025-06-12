import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import JobCard from '../components/JobCard';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, description, status, level, scheduled_date')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error.message);
      } else {
        setJobs(data);
      }

      setLoading(false);
    }

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧰 Job Board</h1>
      {loading ? (
        <p>Loading jobs...</p>
        {jobs.map(job => <JobCard key={job.id} job={job} />)}
     
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <strong>{job.title}</strong><br />
              Level: {job.level}<br />
              Status: {job.status}<br />
              Scheduled: {job.scheduled_date || 'TBD'}<br />
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
