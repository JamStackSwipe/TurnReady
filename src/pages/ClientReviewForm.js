// src/components/ClientReviewForm.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const tagOptions = ['Difficult Access', 'Bad Attitude', 'Unsafe Site', 'Easy Job', 'Repeat Client'];

const ClientReviewForm = ({ jobId, clientId, techId, onSubmitted }) => {
  const [difficulty, setDifficulty] = useState(3);
  const [tags, setTags] = useState([]);
  const [notes, setNotes] = useState('');

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('client_reviews').insert([
      { job_id: jobId, client_id: clientId, tech_id: techId, difficulty, tags, notes },
    ]);
    if (error) {
      toast.error('❌ Failed to submit feedback');
    } else {
      toast.success('✅ Feedback recorded');
      if (onSubmitted) onSubmitted();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <h3 className="text-xl font-bold text-green-700">🔍 Job Difficulty & Notes</h3>

      <label className="block font-medium">Difficulty (1 = Easy, 5 = Brutal)</label>
      <input
        type="range"
        min={1}
        max={5}
        value={difficulty}
        onChange={(e) => setDifficulty(Number(e.target.value))}
        className="w-full"
      />

      <div className="space-y-2">
        <p className="font-medium">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border ${
                tags.includes(tag) ? 'bg-green-600 text-white' : 'bg-gray-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Private notes for admin or other techs..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded-lg p-2"
        rows={3}
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        📝 Submit Feedback
      </button>
    </form>
  );
};

export default ClientReviewForm;
