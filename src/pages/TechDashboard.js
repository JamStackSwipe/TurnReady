import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/AuthProvider';

const TechDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileStats, setProfileStats] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_submissions')
        .select('*')
        .in('status', ['open', 'in progress'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tech jobs:', error.message);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    const fetchProfileStats = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('tech_tier, avg_rating, total_jobs_completed, total_callbacks, total_disputes')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile stats:', error.message);
      } else {
        setProfileStats(data);
      }
    };

    fetchJobs();
    fetchProfileStats();
  }, [user.id]);

  const handleAcceptJob = async (jobId) => {
    const { error } = await supabase
      .from('job_submissions')
      .update({ accepted_by: user.id, status: 'in progress' })
      .eq('id', jobId);

    if (error) {
      console.error('Error accepting job:', error.message);
      return;
    }

    const { data: updatedJobs, error: reloadError } = await supabase
      .from('job_submissions')
      .select('*')
      .in('status', ['open', 'in progress'])
      .order('created_at', { ascending: false });

    if (!reloadError) {
      setJobs(updatedJobs);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">🛠 Tech Dashboard</h1>

      {profileStats && (
        <div className="mb-6 p-4 bg-white border border-blue-100 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">📊 Your Performance Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <p className="font-bold text-lg text-blue-700">Tier {profileStats.tech_tier}</p>
              <p>Performance Level</p>
            </div>
            <div>
              <p className="font-bold text-lg">
                {profileStats.avg_rating?.toFixed(2) || 'N/A'} ⭐
              </p>
              <p>Average Rating</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profileStats.total_jobs_completed || 0}</p>
              <p>Jobs Completed</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profileStats.total_callbacks || 0}</p>
              <p>Callbacks</p>
            </div>
            <div>
              <p className="font-bold text-lg">{profileStats.total_disputes || 0}</p>
              <p>Disputes</p>
            </div>
          </div>
          {profileStats.tech_tier < 3 && (
            <p className="mt-2 text-sm text-gray-500 italic">
              Complete more jobs with strong ratings to level up to Tier {profileStats.tech_tier + 1}!
            </p>
          )}
        </div>
      )}

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
            <li key={job.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow">
              <p className="font-bold text-lg">{job.propertyName}</p>
              <p className="text-sm text-gray-700">{job.description}</p>
              <p className="text-sm text-gray-500">
                📍 {job.region} | 🗓 {new Date(job.created_at).toLocaleDateString()}
              </p>

              {job.accepted_by === user.id && job.door_code ? (
                <p className="text-green-700 font-semibold mt-2">🔐 Door Code: {job.door_code}</p>
              ) : job.accepted_by ? (
                <p className="text-gray-400 italic mt-2">Accepted by another tech</p>
              ) : (
                <button
                  onClick={() => handleAcceptJob(job.id)}
                  className="mt-3 inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  ✅ Accept Job
                </button>
              )}

              <button
                onClick={() => navigate(`/job/${job.id}`)}
                className="mt-2 ml-4 text-blue-600 underline text-sm"
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
