// src/pages/ClientApproval.js

/**
 * ✅ ClientApproval.js
 * -----------------------------------------------------
 * Used by clients or property managers to approve a completed job.
 * 
 * 🔒 Access: client (or admin)
 * 
 * 💡 Flow:
 * - Displays read-only job info and completion notes/photos
 * - Allows client to click “Approve Work” to mark job as done
 * - Triggers status update to 'approved'
 * - Triggers timestamp and possibly sends payment/release notification
 * 
 * ✅ Updates 'job_submissions' table:
 *    - status = 'approved'
 *    - approved_at timestamp
 * 
 * 🚧 Future: May allow clients to reject work, request revisions, or leave feedback
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ClientApproval = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('job_submissions')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error(error);
        toast.error('❌ Error loading job');
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleApproval = async () => {
    setApproving(true);
    try {
      const { error } = await supabase
        .from('job_submissions')
        .update({
          status: 'approved',
          approved_at: new Date(),
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('✅ Work approved!');
      navigate('/my-requests');
    } catch (err) {
      console.error(err);
      toast.error('❌ Error approving job.');
    } finally {
      setApproving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">✅ Client Approval</h1>

        <div className="space-y-3 text-gray-800 mb-6">
          <p><strong>Property:</strong> {job.propertyName}</p>
          <p><strong>Address:</strong> {job.address}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p><strong>Completed Notes:</strong> {job.completed_notes}</p>

          {job.completed_photos?.length > 0 && (
            <div>
              <strong>Photos:</strong>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {job.completed_photos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Completed ${i + 1}`}
                    className="rounded-lg border shadow-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleApproval}
          disabled={approving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {approving ? 'Approving...' : '✅ Approve Work'}
        </button>
      </div>
    </div>
  );
};

export default ClientApproval;
