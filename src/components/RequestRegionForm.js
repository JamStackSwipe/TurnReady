import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const RequestRegionForm = ({ role = 'tech' }) => {
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !region) {
      toast.error('Please fill out both fields.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('region_requests').insert([
      {
        user_email: email,
        requested_region: region,
        role,
      },
    ]);
    setSubmitting(false);

    if (error) {
      toast.error('Something went wrong.');
    } else {
      toast.success('📍 Region request submitted!');
      setEmail('');
      setRegion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700">🌎 Request a New Service Area</h2>
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-3 rounded"
      />
      <input
        type="text"
        placeholder="City or Region You Want"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        required
        className="w-full border p-3 rounded"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? 'Submitting...' : 'Submit Region Request'}
      </button>
    </form>
  );
};

export default RequestRegionForm;
