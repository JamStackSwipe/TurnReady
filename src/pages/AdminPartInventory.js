// src/pages/AdminPartInventory.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const AdminPartInventory = () => {
  const { role } = useUser();
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPart, setNewPart] = useState({ part_name: '', quantity: '', location: '' });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('parts_inventory').select('*').order('part_name');

    if (error) {
      console.error(error);
      toast.error('Error loading parts');
    } else {
      setParts(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPart((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPart = async () => {
    if (!newPart.part_name || !newPart.quantity || !newPart.location) {
      toast.error('Fill in all fields');
      return;
    }

    const { error } = await supabase.from('parts_inventory').insert([newPart]);

    if (error) {
      console.error(error);
      toast.error('Error adding part');
    } else {
      toast.success('Part added');
      setNewPart({ part_name: '', quantity: '', location: '' });
      fetchParts();
    }
  };

  if (role !== 'admin') return <div className="p-6">Access Denied</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">🔧 Admin: Parts Inventory</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            name="part_name"
            placeholder="Part Name"
            value={newPart.part_name}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            value={newPart.quantity}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            name="location"
            placeholder="Location"
            value={newPart.location}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddPart}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-full"
          >
            ➕ Add Part
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Part Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <tr key={part.id}>
                  <td className="border px-4 py-2">{part.part_name}</td>
                  <td className="border px-4 py-2">{part.quantity}</td>
                  <td className="border px-4 py-2">{part.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPartInventory;
