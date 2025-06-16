// src/pages/ClientDashboard.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('job_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading jobs:', error.message);
      } else {
        setJobs(data);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📋 Client Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/my-requests')}
          className="cursor-pointer p-6 bg-white border border-blue-100 rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-xl font-semibold mb-2">📬 My Job Requests</h2>
          <p className="text-gray-600 text-sm">
            View full request history, leave reviews, and track completed jobs.
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading your jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow"
            >
              <p className="font-bold">{job.propertyName || 'Untitled Job'}</p>
              <p className="text-sm text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-500">
                🛠 Level: {job.level || 'N/A'} | 📅 {new Date(job.created_at).toLocaleDateString()}
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

export default ClientDashboard;
