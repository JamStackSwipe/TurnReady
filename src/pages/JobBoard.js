import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const JobBoard = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTechRegionAndJobs = async () => {
      if (!user) {
        toast.error('You must be logged in to access the Job Board.');
        navigate('/login');
        return;
      }

      // Fetch tech profile to get region
      const { data: techProfile, error: profileError } = await supabase
        .from('tech_profiles')
        .select('service_area')
        .eq('user_id', user.id)
        .single();

      if (profileError || !techProfile) {
        toast.error('You are not authorized to view the Job Board.');
        navigate('/');
        return;
      }

      setRegion(techProfile.service_area);

      // Fetch jobs in that region
      const { data: regionJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .ilike('property_name', `%${techProfile.service_area}%`) // or use a dedicated region field
        .eq('status', 'open');

      if (jobsError) {
        toast.error('Failed to load jobs.');
        return;
      }

      setJobs(regionJobs);
      setLoading(false);
    };

    fetchTechRegionAndJobs();
  }, [user, navigate]);

  if (loading) return <div className="p-4">Loading available jobs...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛠️ Jobs in {region}</h2>
      {jobs.length === 0 ? (
        <p>No open jobs in your area yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <p className="text-sm text-gray-500">Property: {job.property_name}</p>
              <p className="text-sm text-gray-500">Scheduled: {job.scheduled_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobBoard;
