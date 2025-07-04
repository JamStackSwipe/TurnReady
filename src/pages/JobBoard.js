import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PropertyCard from '../components/PropertyCard'; // reusable card
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

      // Fetch tech profile
      const { data: techProfile, error: profileError } = await supabase
        .from('tech_profiles')
        .select('service_area, trade')
        .eq('user_id', user.id)
        .single();

      if (profileError || !techProfile) {
        toast.error('You are not authorized to view the Job Board.');
        navigate('/');
        return;
      }

      setProfile(techProfile);

      // Fetch open jobs filtered by region and trade
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

  if (loading) return <div className="p-4">Loading available jobs...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">🛠️ Jobs in {profile?.service_area}</h2>

      <NotificationBanner message="Jobs are updated in real time. Check back often!" />

      {jobs.length === 0 ? (
        <p className="text-gray-600 mt-4">No open jobs in your area yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              {/* PropertyCard reused inline */}
              {job.properties && (
                <div className="p-4">
                  <img
                    src={job.properties.property_photo_url}
                    alt={job.properties.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-lg font-semibold">{job.properties.name}</h3>
                  <p className="text-sm text-gray-600">{job.properties.address}</p>
                  {job.properties.directions && (
                    <p className="text-xs text-gray-500 italic">{job.properties.directions}</p>
                  )}
                  {job.properties.notes && (
                    <p className="text-sm mt-1"><strong>Notes:</strong> {job.properties.notes}</p>
                  )}
                </div>
              )}

              {/* Job info */}
              <div className="p-4 border-t">
                <h4 className="text-md font-semibold">{job.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{job.description}</p>
                <div className="text-sm text-gray-500">
                  <div><strong>Type:</strong> {job.job_type}</div>
                  <div><strong>Urgency:</strong> {job.urgency}</div>
                  <div><strong>Scheduled:</strong> {job.scheduled_date || 'TBD'}</div>
                </div>

                <button
                  onClick={() => handleAcceptJob(job.id)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm"
                >
                  Accept Job
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
