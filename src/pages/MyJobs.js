// src/pages/MyJobs.js
import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import ClientReviewForm from '../components/ClientReviewForm';
import toast from 'react-hot-toast';

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
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🛠 My Assigned Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>

              {job.status === 'completed' && (
                <button
                  onClick={() => setSelectedJob(job)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                >
                  📝 Rate Property / Owner
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {selectedJob && (
        <div className="mt-6">
          <ClientReviewForm
            jobId={selectedJob.id}
            clientId={selectedJob.client_id}
            techId={user.id}
            onSubmitted={() => setSelectedJob(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MyJobs;
