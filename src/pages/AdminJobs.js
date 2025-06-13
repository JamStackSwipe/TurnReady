// src/pages/AdminJobs.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id, title, status, region, scheduled_date, created_at, tech_id, property_name, address
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🛠️ Admin: Job Submissions</h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const isUnassigned = !job.tech_id || job.status === 'unassigned_due_to_no_tech';
            return (
              <div
                key={job.id}
                className={`p-4 rounded-xl shadow-md border ${
                  isUnassigned ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {job.title} {isUnassigned && <span className="text-sm text-red-600">(Unassigned)</span>}
                  </h2>
                  <span className="text-sm text-gray-600">{format(new Date(job.created_at), 'PPpp')}</span>
                </div>
                <p className="text-gray-700 mt-1">
                  <strong>Region:</strong> {job.region} &nbsp;|&nbsp;
                  <strong>Scheduled:</strong> {job.scheduled_date || 'N/A'}
                </p>
                <p className="text-gray-700">
                  <strong>Property:</strong> {job.property_name || 'N/A'}<br />
                  <strong>Address:</strong> {job.address || 'N/A'}
                </p>
                <p className="text-sm mt-2">
                  <strong>Status:</strong> {job.status}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
