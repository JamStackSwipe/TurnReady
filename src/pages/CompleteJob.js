// Updated CompleteJob.js with support for multiple media types and admin override
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const mediaTypes = ['before', 'after', 'gauge', 'temp', 'issue', 'solution', 'other'];

const CompleteJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, role } = useUser();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*, properties(*)')
        .eq('id', jobId)
        .single();

      if (error) {
        toast.error('❌ Error loading job.');
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleFileChange = (index, file) => {
    const newFiles = [...mediaFiles];
    newFiles[index].file = file;
    setMediaFiles(newFiles);
  };

  const handleAddFile = () => {
    setMediaFiles([...mediaFiles, { file: null, type: 'other' }]);
  };

  const handleTypeChange = (index, type) => {
    const newFiles = [...mediaFiles];
    newFiles[index].type = type;
    setMediaFiles(newFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !jobId) return;

    if (role !== 'admin' && job?.tech_id !== user.id) {
      toast.error('You do not have permission to complete this job.');
      return;
    }

    setUploading(true);
    try {
      const uploads = [];

      for (const [index, media] of mediaFiles.entries()) {
        if (!media.file) continue;

        const filePath = `job-media/${jobId}/${Date.now()}-${media.type}-${media.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('job-media')
          .upload(filePath, media.file);

        if (uploadError) throw uploadError;

        const { publicUrl } = supabase.storage
          .from('job-media')
          .getPublicUrl(filePath).data;

        uploads.push({
          job_id: jobId,
          user_id: user.id,
          media_type: media.type,
          file_url: publicUrl,
        });
      }

      if (uploads.length > 0) {
        const { error: mediaInsertError } = await supabase.from('job_media').insert(uploads);
        if (mediaInsertError) throw mediaInsertError;
      }

      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          completed_notes: notes,
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
          <p><strong>Property:</strong> {job.properties?.name}</p>
          <p><strong>Address:</strong> {job.properties?.address}</p>
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

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Upload Media</span>
              <button
                type="button"
                onClick={handleAddFile}
                className="text-blue-600 hover:underline"
              >
                ➕ Add File
              </button>
            </div>

            {mediaFiles.map((media, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-4 border p-3 rounded">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                  className="flex-1"
                  required
                />
                <select
                  value={media.type}
                  onChange={(e) => handleTypeChange(index, e.target.value)}
                  className="border p-2 rounded"
                >
                  {mediaTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:underline"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

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
