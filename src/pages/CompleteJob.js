import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const mediaCategories = [
  'before',
  'during',
  'after',
  'temp_readings',
  'meter_gauges',
  'video'
];

const CompleteJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [job, setJob] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState({
    before: [],
    during: [],
    after: [],
    temp_readings: [],
    meter_gauges: [],
    video: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, property_name, address, description')
        .eq('id', jobId)
        .single();

      if (error) {
        console.error(error);
        toast.error('❌ Failed to load job');
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleFileChange = (e, category) => {
    const files = Array.from(e.target.files);
    setMedia(prev => ({
      ...prev,
      [category]: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const allUploadedMedia = [];

      for (const category of mediaCategories) {
        for (const file of media[category]) {
          const path = `job-media/${jobId}/${category}/${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('job-photos')
            .upload(path, file);

          if (error) throw error;

          const publicUrl = supabase.storage
            .from('job-photos')
            .getPublicUrl(path).data.publicUrl;

          allUploadedMedia.push({
            job_id: jobId,
            category,
            media_url: publicUrl,
            uploaded_by: user.id,
          });
        }
      }

      // Insert all media
      if (allUploadedMedia.length > 0) {
        const { error: mediaInsertError } = await supabase
          .from('job_media')
          .insert(allUploadedMedia);
        if (mediaInsertError) throw mediaInsertError;
      }

      // Update job with completion notes + mark as completed
      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          completed_notes: notes,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);

      if (updateError) throw updateError;

      toast.success('✅ Job marked as completed!');
      navigate('/tech-dashboard');
    } catch (err) {
      console.error(err);
      toast.error('❌ Error submitting completion');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading job...</div>;
  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-green-700">📸 Complete Job</h1>

        <div className="mb-4">
          <p><strong>Property:</strong> {job.property_name}</p>
          <p><strong>Address:</strong> {job.address}</p>
          <p><strong>Description:</strong> {job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm font-semibold">Completion Notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full border p-3 rounded mt-1"
              required
            />
          </label>

          {mediaCategories.map((cat) => (
            <div key={cat}>
              <label className="block font-medium capitalize text-gray-700">
                {cat.replace('_', ' ')} {cat === 'video' ? '(optional)' : ''}
              </label>
              <input
                type="file"
                accept={cat === 'video' ? 'video/*' : 'image/*'}
                multiple
                onChange={(e) => handleFileChange(e, cat)}
                className="mt-1"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            {uploading ? 'Uploading...' : '✅ Submit Completion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteJob;
