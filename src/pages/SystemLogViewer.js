// src/pages/SystemLogViewer.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const SystemLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error('Failed to load logs');
    } else {
      setLogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading system logs...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">🗂️ System Logs</h1>
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs found.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-50 p-4 border rounded-lg shadow-sm"
              >
                <p className="text-sm text-gray-700">
                  <strong>{log.action_type}</strong> by <em>{log.performed_by || 'Unknown'}</em>
                </p>
                <p className="text-sm text-gray-500">
                  {log.description}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemLogViewer;
