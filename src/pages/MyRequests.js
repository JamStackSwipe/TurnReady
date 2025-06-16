// src/pages/MyRequests.js
import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import TechReviewForm from '../components/TechReviewForm';
import JobStatusBadge from '../components/JobStatusBadge';

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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📋 My Job Requests</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="bg-white p-4 rounded-xl shadow border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <JobStatusBadge status={job.status} />
              </div>

              <p className="text-gray-700 mt-1">{job.description}</p>
              <p className="text-sm text-gray-500">Scheduled: {job.scheduled_date || 'TBD'}</p>

              {job.status === 'completed' && job.tech_id && (
                <button
                  onClick={() => setSelectedJob(job)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  ⭐ Review Technician
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedJob && (
        <div className="mt-8">
          <TechReviewForm
            jobId={selectedJob.id}
            techId={selectedJob.tech_id}
            clientId={user.id}
            onSubmitted={() => {
              toast.success('Review submitted!');
              setSelectedJob(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyRequests;
