// src/pages/TechNotes.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const TechNotes = () => {
  const { id } = useParams(); // job_submission ID
  const navigate = useNavigate();
  const { user } = useUser();

  const [job, setJob] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('job_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading job:', error);
        toast.error('Error loading job');
      } else {
        setJob(data);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('job_notes').insert([
      {
        job_id: id,
        tech_id: user.id,
        note: note.trim(),
      },
    ]);

    if (error) {
      console.error(error);
      toast.error('Error saving note');
    } else {
      toast.success('✅ Note saved!');
      navigate(`/job-details/${id}`);
    }

    setSubmitting(false);
  };

  if (!job) return <div className="p-6 text-center">Loading job...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4 text-blue-700">🛠️ Add Technician Note</h1>
        <p className="text-gray-700 mb-2">
          <strong>Job:</strong> {job.propertyName || 'N/A'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            placeholder="Write your note, diagnosis, or internal update here..."
            className="w-full p-3 border rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 font-semibold"
          >
            {submitting ? 'Saving...' : '✍️ Save Note'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TechNotes;
