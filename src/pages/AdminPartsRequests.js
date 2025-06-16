import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const AdminPartsRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('parts_requests')
      .select(`
        *,
        job_submissions (propertyName, region),
        profiles (full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load part requests');
      console.error(error);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">🔧 All Parts Requests</h1>
        {requests.length === 0 ? (
          <p className="text-gray-500">No part requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50 space-y-2"
              >
                <p><strong>Requested by:</strong> {req.profiles?.full_name || 'Unknown'} ({req.profiles?.email})</p>
                <p><strong>Job:</strong> {req.job_submissions?.propertyName} ({req.job_submissions?.region})</p>
                <p><strong>Part Name:</strong> {req.common_name}</p>
                <p><strong>Tech Term:</strong> {req.technical_name}</p>
                <p><strong>Model/Serial:</strong> {req.model_serial}</p>
                <p><strong>Part Numbers:</strong> {req.part_numbers}</p>
                <p><strong>Notes:</strong> {req.notes}</p>
                <p><strong>Requested On:</strong> {new Date(req.created_at).toLocaleString()}</p>
                {req.photo_url && (
                  <a
                    href={req.photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📷 View Photo
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPartsRequests;
