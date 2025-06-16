import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

/**
 * AdminPartsApproval.js
 * This page allows an admin to view and approve/deny part requests from techs.
 * Related table: `parts_requests`
 */

const AdminPartsApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('parts_requests')
      .select(`
        *,
        job_submissions (propertyName, region),
        profiles (full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error('Failed to load requests');
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('parts_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
      console.error(error);
    } else {
      toast.success(`Request ${newStatus}`);
      fetchRequests(); // refresh
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">🛠️ Parts Request Approval</h1>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500">No part requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="border p-4 rounded-lg shadow-sm bg-gray-50 space-y-2">
                <p><strong>From:</strong> {req.profiles?.full_name || 'Unknown'}</p>
                <p><strong>Job:</strong> {req.job_submissions?.propertyName} ({req.job_submissions?.region})</p>
                <p><strong>Part:</strong> {req.common_name} ({req.technical_name})</p>
                <p><strong>Model/Serial:</strong> {req.model_serial}</p>
                <p><strong>Status:</strong> {req.status || 'pending'}</p>
                {req.photo_url && (
                  <a href={req.photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">📷 View Photo</a>
                )}
                <div className="space-x-2 mt-2">
                  <button
                    onClick={() => updateStatus(req.id, 'approved')}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, 'denied')}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPartsApproval;
