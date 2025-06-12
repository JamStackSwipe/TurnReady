import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

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
