// src/pages/TechDashboard.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const TechDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .in('status', ['open', 'in progress']) // Filter active jobs
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛠 Tech Dashboard</h1>

      {/* Snapshot: My Jobs tile */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/my-jobs')}
          className="cursor-pointer p-6 bg-white border border-green-200 rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-2">📂 My Completed Jobs</h2>
          <p className="text-gray-600 text-sm">
            View past work, leave ratings for properties or clients, and track reviews.
          </p>
        </div>
      </div>

      {/* Existing Active Jobs List */}
      {loading ? (
        <p>Loading jobs for techs...</p>
      ) : jobs.length === 0 ? (
        <p>No active jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li
              key={job.id}
              className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow"
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
