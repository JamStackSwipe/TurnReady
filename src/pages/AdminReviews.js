// src/pages/AdminReviews.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AdminReviews = () => {
  const [techReviews, setTechReviews] = useState([]);
  const [clientReviews, setClientReviews] = useState([]);

  useEffect(() => {
    const fetchAllReviews = async () => {
      const { data: tech, error: techError } = await supabase.from('tech_reviews').select('*').order('created_at', { ascending: false });
      const { data: client, error: clientError } = await supabase.from('client_reviews').select('*').order('created_at', { ascending: false });

      if (techError || clientError) {
        console.error('Review loading error:', techError || clientError);
      } else {
        setTechReviews(tech);
        setClientReviews(client);
      }
    };

    fetchAllReviews();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">⭐ Admin: All Reviews</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">🧑‍🔧 Tech Reviews (by Clients)</h2>
      <div className="grid gap-4">
        {techReviews.map((r) => (
          <div key={r.id} className="p-4 bg-white border rounded shadow">
            <p><strong>Tech ID:</strong> {r.tech_id}</p>
            <p><strong>Client ID:</strong> {r.client_id}</p>
            <p><strong>Stars:</strong> {r.stars}</p>
            <p><strong>Tags:</strong> {r.tags?.join(', ') || 'None'}</p>
            <p><strong>Comment:</strong> {r.comment || '—'}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">🏡 Client Reviews (by Techs)</h2>
      <div className="grid gap-4">
        {clientReviews.map((r) => (
          <div key={r.id} className="p-4 bg-white border rounded shadow">
            <p><strong>Client ID:</strong> {r.client_id}</p>
            <p><strong>Tech ID:</strong> {r.tech_id}</p>
            <p><strong>Difficulty:</strong> {r.difficulty}</p>
            <p><strong>Tags:</strong> {r.tags?.join(', ') || 'None'}</p>
            <p><strong>Notes:</strong> {r.notes || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
