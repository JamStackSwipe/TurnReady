// src/pages/PaymentHistory.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const { user } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading payments:', error);
        toast.error('Failed to load payment history');
      } else {
        setPayments(data);
      }

      setLoading(false);
    };

    fetchPayments();
  }, [user]);

  if (loading) return <div className="p-6 text-center">Loading payment history...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">💳 Payment History</h1>

        {payments.length === 0 ? (
          <p className="text-gray-500">No payment history found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Amount</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t">
                    <td className="p-3">
                      {new Date(payment.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">${payment.amount?.toFixed(2)}</td>
                    <td className="p-3">{payment.type}</td>
                    <td className="p-3">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
