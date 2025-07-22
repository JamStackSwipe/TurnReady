import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import NotificationBanner from '../components/NotificationBanner';

const JobBoard = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        toast.error('You must be logged in to access the Job Board.');
        navigate('/login');
        return;
      }

      // Get role from 'profiles' table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        toast.error('Unable to load user role.');
        return;
      }

      const role = profileData.role;
      setProfile(profileData);

      // Fetch job data based on role
      if (role === 'tech') {
        const { data: techProfile, error: techError } = await supabase
          .from('tech_profiles')
          .select('service_area, trade')
          .eq('user_id', user.id)
          .single();

        if (techError || !techProfile) {
          toast.error('Tech profile not found.');
          return;
        }

        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select(`
            *,
            properties (
              id,
              name,
              address,
              directions,
              notes,
              property_photo_url
            )
          `)
          .eq('region', techProfile.service_area)
          .eq('job_type', techProfile.trade)
          .eq('status', 'open');

        if (jobsError) {
          toast.error('Failed to load jobs.');
          console.error(jobsError);
          return;
        }

        setJobs(jobsData);
      } else if (role === 'client') {
        const { data: clientJobs, error: clientError } = await supabase
          .from('jobs')
          .select(`
            *,
            properties (
              name,
              address,
              property_photo_url
            )
          `)
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        if (clientError) {
          toast.error('Failed to load your jobs.');
          console.error(clientError);
          return;
        }

        setJobs(clientJobs);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, navigate]);

  const handleAcceptJob = async (jobId) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'assigned', accepted_by: user.id })
      .eq('id', jobId);

    if (error) {
      toast.error('Failed to accept job.');
    } else {
      toast.success('Job accepted!');
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    }
  };

  if (loading) return <div className="p-4">Loading jobs...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">
        {profile?.role === 'client' ? '📋 Your Submitted Jobs' : '🛠️ Jobs in Your Area'}
      </h2>

      <NotificationBanner message="Jobs are updated in real time. Check back often!" />

      {jobs.length === 0 ? (
        <p className="text-gray-600 mt-4">
          {profile?.role === 'client'
            ? 'You haven’t submitted any jobs yet.'
            : 'No open jobs in your area yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden"
            >
              {job.properties && (
                <div className="p-4">
                  <img
                    src={job.properties.property_photo_url}
                    alt={job.properties.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold">{job.properties.name}</h3>
                  <p className="text-sm text-gray-600">{job.properties.address}</p>
                </div>
              )}

              <div className="p-4 border-t">
                <h4 className="text-md font-semibold">{job.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{job.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <div><strong>Type:</strong> {job.job_type}</div>
                  <div><strong>Status:</strong> {job.status}</div>
                  <div><strong>Scheduled:</strong> {job.scheduled_date || 'TBD'}</div>
                </div>

                {profile?.role === 'tech' && (
                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
                  >
                    Accept Job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
