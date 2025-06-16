// src/pages/MyJobs.js
import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import ClientReviewForm from '../components/ClientReviewForm';
import JobStatusBadge from '../components/JobStatusBadge';

const MyJobs = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchMyJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('tech_id', user.id)
        .order('scheduled_date', { ascending: false });

      if (error) {
        toast.error('Failed to load your jobs');
      } else {
        setJobs(data);
      }
    };

    if (user) fetchMyJobs();
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🛠 My Assigned Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs yet.</p>
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

              {job.status === 'completed' && (
                <button
                  onClick={() => setSelectedJob(job)}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  📝 Rate Property / Owner
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedJob && (
        <div className="mt-8">
          <ClientReviewForm
            jobId={selectedJob.id}
            clientId={selectedJob.client_id}
            techId={user.id}
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

export default MyJobs;
