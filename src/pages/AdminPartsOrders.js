// src/pages/AdminPartsOrders.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const AdminPartsOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('parts_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load parts orders');
      console.error(error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('parts_orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Order status updated');
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">📦 Admin Parts Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No part orders found.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Job ID</th>
                <th className="p-2">Part</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Status</th>
                <th className="p-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-2">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="p-2">{order.job_id}</td>
                  <td className="p-2">{order.part_name}</td>
                  <td className="p-2">{order.quantity}</td>
                  <td className="p-2">{order.status}</td>
                  <td className="p-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="ordered">Ordered</option>
                      <option value="delivered">Delivered</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPartsOrders;
