// src/pages/DisputeCenter.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const DisputeCenter = () => {
  const { user } = useUser();
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error('Failed to load disputes');
    } else {
      setDisputes(data);
    }
    setLoading(false);
  };

  const submitDispute = async () => {
    if (!newDispute.trim()) return toast.error('Please enter a description');

    const { error } = await supabase.from('disputes').insert([
      {
        user_id: user.id,
        description: newDispute.trim(),
      },
    ]);

    if (error) {
      console.error(error);
      toast.error('Failed to submit dispute');
    } else {
      toast.success('Dispute submitted');
      setNewDispute('');
      fetchDisputes();
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [user]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-red-700 mb-4">🚨 Dispute Center</h1>

        <div className="space-y-4 mb-6">
          <textarea
            value={newDispute}
            onChange={(e) => setNewDispute(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded"
            placeholder="Describe your concern or issue in detail..."
          />
          <button
            onClick={submitDispute}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Submit Dispute
          </button>
        </div>

        <h2 className="text-lg font-semibold mb-2">Your Past Disputes</h2>
        {disputes.length === 0 ? (
          <p className="text-gray-500">No disputes submitted yet.</p>
        ) : (
          <ul className="space-y-3">
            {disputes.map((d) => (
              <li key={d.id} className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-700">{d.description}</p>
                <p className="text-xs text-gray-400">
                  Submitted: {new Date(d.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DisputeCenter;
