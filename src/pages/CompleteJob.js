// src/pages/CompleteJob.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const CompleteJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('job_submissions')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error(error);
        toast.error('❌ Error loading job.');
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleFileChange = (e) => {
    setPhotoFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !jobId) return;

    setUploading(true);

    try {
      const photoUrls = [];

      for (const file of photoFiles) {
        const filePath = `job-completions/${jobId}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('job-photos')
          .upload(filePath, file);

        if (error) throw error;

        const { publicUrl } = supabase.storage
          .from('job-photos')
          .getPublicUrl(filePath).data;

        photoUrls.push(publicUrl);
      }

      const { error: updateError } = await supabase
        .from('job_submissions')
        .update({
          completed_notes: notes,
          completed_photos: photoUrls,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      if (updateError) throw updateError;

      toast.success('✅ Job marked complete!');
      navigate('/my-jobs');
    } catch (err) {
      console.error(err);
      toast.error('❌ Error completing job.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading job...</div>;
  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-green-700">📸 Complete Job</h1>

        <div className="mb-6 space-y-2 text-gray-800">
          <p><strong>Property:</strong> {job.propertyName}</p>
          <p><strong>Address:</strong> {job.address}</p>
          <p><strong>Description:</strong> {job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="font-medium text-gray-700">Completion Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full mt-1 p-3 border rounded-lg"
              placeholder="Describe the work completed, any issues resolved, etc."
              required
            />
          </label>

          <label className="block">
            <span className="font-medium text-gray-700">Upload Completion Photos</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1"
              required
            />
          </label>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {uploading ? 'Uploading...' : '✅ Submit Completion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteJob;
