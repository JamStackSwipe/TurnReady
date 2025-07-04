// src/pages/JobUpdate.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useUser } from '../components/AuthProvider';

const JobUpdate = () => {
  const { user, role } = useUser();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [needsPart, setNeedsPart] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        toast.error('Job not found');
        return;
      }

      setJob(data);
      setStatus(data.status || '');
      setNotes(data.notes || '');
      setLoading(false);
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleMediaChange = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !jobId) return;

    setUploading(true);

    try {
      const mediaUrls = [];

      for (const file of mediaFiles) {
        const path = `job-updates/${jobId}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('job-photos')
          .upload(path, file);

        if (error) throw error;

        const { publicUrl } = supabase.storage
          .from('job-photos')
          .getPublicUrl(path).data;

        mediaUrls.push({
          url: publicUrl,
          type: file.type.startsWith('video/') ? 'video' : 'photo',
          uploaded_by: user.id,
          job_id: jobId,
        });
      }

      const updates = {
        notes,
        status,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId);

      if (updateError) throw updateError;

      // Insert media records
      if (mediaUrls.length > 0) {
        const { error: mediaError } = await supabase
          .from('job_media')
          .insert(mediaUrls);
        if (mediaError) throw mediaError;
      }

      toast.success('✅ Job updated');
      
      // Trigger client notification
      if (job?.client_id) {
        await supabase.from('notifications').insert([{
          user_id: job.client_id,
          message: `Job "${job.title}" was updated.`,
          job_id: jobId,
          type: 'job_update',
          seen: false,
        }]);
      }

      if (needsPart) {
        navigate(`/parts-request/${jobId}`);
      } else {
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Error updating job.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">✏️ Update Job: {job?.title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Update Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded-lg p-3"
          rows={5}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Status</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_on_parts">Waiting on Parts</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={needsPart}
            onChange={(e) => setNeedsPart(e.target.checked)}
            className="h-4 w-4"
          />
          <span>🧩 Request Part</span>
        </label>

        <label className="block">
          <span className="font-medium text-gray-700">📸 Upload Media</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            className="w-full mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          {uploading ? 'Updating...' : '✅ Save Update'}
        </button>
      </form>
    </div>
  );
};

export default JobUpdate;
