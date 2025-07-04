import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

import ClientReviewForm from '../components/ClientReviewForm';
import TechReviewForm from '../components/TechReviewForm';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useUser();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        properties (
          name,
          address,
          directions,
          notes,
          property_photo_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Error loading job');
      console.error(error);
    } else {
      setJob(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleAcceptJob = async () => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'assigned', accepted_by: user.id })
      .eq('id', job.id);

    if (error) {
      toast.error('Failed to accept job');
      return;
    }

    toast.success('Job accepted!');
    fetchJob(); // refresh job data
  };

  const handleRequestPart = () => {
    navigate(`/parts-request/${job.id}`);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  const isAssignedTech = job.accepted_by === user.id;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">🧾 Job Details</h1>

        {/* 📷 Property Card Block */}
        {job.properties && (
          <div className="mb-6">
            {job.properties.property_photo_url && (
              <img
                src={job.properties.property_photo_url}
                alt={job.properties.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <h2 className="text-lg font-semibold">{job.properties.name}</h2>
            <p className="text-sm text-gray-600">{job.properties.address}</p>
            {job.properties.directions && (
              <p className="text-sm text-gray-500 italic mt-1">{job.properties.directions}</p>
            )}
            {job.properties.notes && (
              <p className="text-sm text-gray-700 mt-2"><strong>Notes:</strong> {job.properties.notes}</p>
            )}
          </div>
        )}

        {/* 📋 Job Info Block */}
        <div className="space-y-2 text-gray-800 mb-6">
          <p><strong>Job Title:</strong> {job.title}</p>
          <p><strong>Type:</strong> {job.job_type}</p>
          <p><strong>Urgency:</strong> {job.urgency}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Scheduled:</strong> {job.scheduled_date || 'TBD'}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p className="text-sm text-gray-500">Submitted: {new Date(job.created_at).toLocaleString()}</p>
        </div>

        {/* 🧰 Tech-only Action Buttons */}
        {(role === 'tech' || role === 'admin') && (
          <div className="mt-6 space-y-3">
            {!job.accepted_by && (
              <button
                onClick={handleAcceptJob}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                ✅ Accept Job
              </button>
            )}
            {isAssignedTech && (
              <>
                <button
                  onClick={handleRequestPart}
                  className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                >
                  🛠️ Request Part
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  📸 Mark Completed
                </button>
              </>
            )}
          </div>
        )}

        {/* 📝 Tech Review Form */}
        {isAssignedTech && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Tech Notes & Completion</h2>
            <TechReviewForm jobId={id} />
          </div>
        )}

        {/* 🧑‍💼 Client Feedback */}
        {(role === 'client' || role === 'admin') && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Client Feedback</h2>
            <ClientReviewForm jobId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
