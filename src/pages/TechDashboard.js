// src/pages/TechDashboard.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const TechDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('job_submissions')
        .select('*')
        .in('status', ['open', 'in progress']) // Only show active jobs
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tech jobs:', error.message);
      } else {
        setJobs(data);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🛠 Tech Dashboard</h1>

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

      {loading ? (
        <p>Loading jobs for techs...</p>
      ) : jobs.length === 0 ? (
        <p>No active jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow"
            >
              <p className="font-bold">{job.propertyName}</p>
              <p className="text-sm text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-500">
                📍 {job.region} | 🗓 {new Date(job.created_at).toLocaleDateString()}
              </p>
              <button
                onClick={() => navigate(`/job/${job.id}`)}
                className="mt-2 inline-block text-blue-600 underline text-sm"
              >
                View Job →
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TechDashboard;
