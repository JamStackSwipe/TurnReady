// src/components/TechReviewForm.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const tagOptions = ['On Time', 'Clean', 'Courteous', 'Slow', 'Unprepared'];

const TechReviewForm = ({ jobId, techId, clientId, onSubmitted }) => {
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState('');

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('tech_reviews').insert([
      { job_id: jobId, tech_id: techId, client_id: clientId, stars, tags, comment },
    ]);
    if (error) {
      toast.error('❌ Failed to submit review');
    } else {
      toast.success('✅ Review submitted');
      if (onSubmitted) onSubmitted();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">
      <h3 className="text-xl font-bold text-blue-700">⭐ Rate Your Technician</h3>

      <label className="block font-medium">Star Rating</label>
      <select
        value={stars}
        onChange={(e) => setStars(Number(e.target.value))}
        className="border p-2 rounded w-full"
      >
        {[5, 4, 3, 2, 1].map((val) => (
          <option key={val} value={val}>{val} Star{val > 1 && 's'}</option>
        ))}
      </select>

      <div className="space-y-2">
        <p className="font-medium">Tags</p>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border ${
                tags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <textarea
        placeholder="Optional comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-lg p-2"
        rows={3}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        ✅ Submit Review
      </button>
    </form>
  );
};

export default TechReviewForm;
