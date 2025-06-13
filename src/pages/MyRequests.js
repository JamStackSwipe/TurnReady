// src/pages/MyRequests.js
import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import TechReviewForm from '../components/TechReviewForm';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchMyRequests = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: false });

      if (error) {
        toast.error('Failed to load your requests');
      } else {
        setJobs(data);
      }
    };

    if (user) fetchMyRequests();
  }, [user]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📋 My Job Requests</h2>

      {jobs.length === 0 ? (
        <p>No jobs submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>

              {job.status === 'completed' && job.tech_id && (
                <button
                  onClick={() => setSelectedJob(job)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  ⭐ Review Technician
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedJob && (
        <div className="mt-6">
          <TechReviewForm
            jobId={selectedJob.id}
            techId={selectedJob.tech_id}
            clientId={user.id}
            onSubmitted={() => setSelectedJob(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MyRequests;
