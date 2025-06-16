// src/pages/PaymentHistory.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const PaymentHistory = () => {
  const { user } = useUser();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error('Failed to load payment history');
    } else {
      setPayments(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">💳 Payment History</h1>
        {payments.length === 0 ? (
          <p className="text-gray-500">No payment history found.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t">
                  <td className="p-2">{new Date(payment.created_at).toLocaleString()}</td>
                  <td className="p-2">${payment.amount.toFixed(2)}</td>
                  <td className="p-2">{payment.type}</td>
                  <td className="p-2">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
