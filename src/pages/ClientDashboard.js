// src/pages/ClientDashboard.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📋 Client Dashboard</h1>

      {/* 🔗 Snapshot tile to full My Requests page */}
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

      {/* 🔄 Existing job snapshot list */}
      {loading ? (
        <p>Loading your jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li
              key={job.id}
              className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow"
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
