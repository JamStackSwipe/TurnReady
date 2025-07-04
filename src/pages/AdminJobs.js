import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          status,
          region,
          scheduled_date,
          created_at,
          tech_id,
          accepted_by,
          property_name,
          address
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

  const statusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'in_progress':
        return 'border-blue-500 bg-blue-50';
      case 'waiting_on_parts':
        return 'border-yellow-500 bg-yellow-50';
      case 'scheduled':
        return 'border-indigo-500 bg-indigo-50';
      case 'assigned':
        return 'border-gray-400 bg-white';
      default:
        return 'border-red-500 bg-red-50'; // includes 'unassigned' or null
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🛠️ Admin: Job Submissions</h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const isUnassigned = !job.accepted_by;
            return (
              <div
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className={`p-4 rounded-xl shadow-md border cursor-pointer hover:shadow-lg transition ${statusColor(job.status)}`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {job.title}{' '}
                    {isUnassigned && (
                      <span className="text-sm text-red-600 font-medium">(Unassigned)</span>
                    )}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {format(new Date(job.created_at), 'PPpp')}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-sm text-gray-800">
                  <p>
                    <strong>Region:</strong> {job.region || 'N/A'} |{' '}
                    <strong>Scheduled:</strong> {job.scheduled_date || 'Not Scheduled'}
                  </p>
                  <p>
                    <strong>Property:</strong> {job.property_name || 'N/A'}
                  </p>
                  <p>
                    <strong>Address:</strong> {job.address || 'N/A'}
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Status:</strong>{' '}
                    <span className="capitalize font-medium">{job.status || 'unassigned'}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
