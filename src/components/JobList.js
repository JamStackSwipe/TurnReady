import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import JobCard from './JobCard';

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error.message);
      } else {
        setJobs(data);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Jobs</h2>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
