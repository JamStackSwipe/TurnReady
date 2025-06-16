// src/pages/ReferralSystem.js

import React, { useEffect, useState } from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ReferralSystem = () => {
  const { user } = useUser();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/signup?ref=${user?.id}`;

  const fetchReferrals = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load referrals');
      console.error(error);
    } else {
      setReferrals(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReferrals();
  }, [user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">🤝 Referral Program</h1>

        <div className="mb-6">
          <p className="mb-2">Share your referral link to invite friends or techs:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-sm"
            />
            <button
              onClick={handleCopy}
              className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-2">📋 Referral History</h2>
        {loading ? (
          <p>Loading...</p>
        ) : referrals.length === 0 ? (
          <p className="text-gray-500">No referrals yet.</p>
        ) : (
          <ul className="space-y-3">
            {referrals.map((ref) => (
              <li key={ref.id} className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-700">
                  Referred user ID: {ref.referred_id}
                </p>
                <p className="text-xs text-gray-400">
                  Date: {new Date(ref.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReferralSystem;
