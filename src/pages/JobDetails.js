// src/pages/JobDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(error);
      toast.error('Error loading job details');
    } else {
      setJob(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">🧾 Job Details</h1>

        <div className="space-y-2 text-gray-800">
          <p><strong>Region:</strong> {job.region}</p>
          <p><strong>Property Name:</strong> {job.propertyName}</p>
          <p><strong>Address:</strong> {job.address}</p>
          <p><strong>Phone:</strong> {job.contactPhone}</p>
          <p><strong>Email:</strong> {job.contactEmail}</p>
          <p><strong>Management Company:</strong> {job.propertyManagementCompany}</p>
          <p><strong>Owner:</strong> {job.ownerName}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Guest Present:</strong> {job.guestPresent ? 'Yes' : 'No'}</p>
          <p><strong>Emergency:</strong> {job.emergency ? 'Yes' : 'No'}</p>
          <p><strong>Requested By:</strong> {job.serviceRequestedBy}</p>
          <p className="text-sm text-gray-500">Submitted: {new Date(job.created_at).toLocaleString()}</p>
        </div>

        {/* Placeholder for future buttons */}
        <div className="mt-6 space-x-3">
          {/* Tech view buttons */}
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ✅ Accept Job
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            ✍️ Add Note / Request Part
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            📸 Mark Completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
