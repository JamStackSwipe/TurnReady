// src/pages/AdminRegionRequests.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import RequireRole from '../components/RequireRole';

const AdminRegionRequests = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('region_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching region requests:', error);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  const groupByRegion = () => {
    const grouped = {};
    for (const r of requests) {
      const key = r.requested_region.trim();
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(r);
    }
    return grouped;
  };

  const groupedData = groupByRegion();

  return (
    <RequireRole role="admin">
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">📍 Region Requests</h1>

        {loading ? (
          <p>Loading...</p>
        ) : Object.keys(groupedData).length === 0 ? (
          <p>No region requests yet.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedData).map(([region, entries]) => (
              <div
                key={region}
                className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500"
              >
                <h2 className="text-xl font-semibold">{region}</h2>
                <p className="text-sm text-gray-500">
                  {entries.length} request(s) — {entries.filter(e => e.role === 'tech').length} tech /
                  {entries.filter(e => e.role === 'client').length} client
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {entries.map((r) => (
                    <li key={r.id}>
                      • {r.user_email} ({r.role}) — {new Date(r.created_at).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </RequireRole>
  );
};

export default AdminRegionRequests;
