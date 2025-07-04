// src/pages/JobDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

import ClientReviewForm from '../components/ClientReviewForm';
import TechReviewForm from '../components/TechReviewForm';
import MediaGallery from '../components/MediaGallery';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useUser();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Complete Modal State
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionFiles, setCompletionFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        properties (
          name,
          address,
          directions,
          notes,
          property_photo_url
        ),
        job_media (
          id,
          media_url,
          media_type,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Error loading job');
      console.error(error);
    } else {
      setJob(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleAcceptJob = async () => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'assigned', accepted_by: user.id })
      .eq('id', job.id);

    if (error) {
      toast.error('Failed to accept job');
      return;
    }

    toast.success('Job accepted!');
    fetchJob();
  };

  const handleRequestPart = () => {
    navigate(`/parts-request/${job.id}`);
  };

  // Quick Complete Modal handlers
  const openCompleteModal = () => {
    setCompletionNotes('');
    setCompletionFiles([]);
    setIsCompleteModalOpen(true);
  };

  const closeCompleteModal = () => {
    setIsCompleteModalOpen(false);
  };

  const handleCompletionFilesChange = (e) => {
    setCompletionFiles(Array.from(e.target.files));
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completionNotes.trim() && completionFiles.length === 0) {
      toast.error('Please add notes or upload photos/videos before submitting.');
      return;
    }
    setUploading(true);

    try {
      const uploadedMediaUrls = [];

      for (const file of completionFiles) {
        const fileExt = file.name.split('.').pop();
        const filePath = `job-completions/${job.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('job-photos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('job-photos')
          .getPublicUrl(filePath);

        uploadedMediaUrls.push({
          media_url: publicUrl,
          media_type: file.type.startsWith('video') ? 'video' : 'image',
        });
      }

      // Insert media records in job_media table
      for (const media of uploadedMediaUrls) {
        await supabase.from('job_media').insert({
          job_id: job.id,
          media_url: media.media_url,
          media_type: media.media_type,
        });
      }

      // Update job with completion details
      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          status: 'completed',
          completed_notes: completionNotes,
          completed_at: new Date().toISOString(),
        })
        .eq('id', job.id);

      if (updateError) throw updateError;

      toast.success('✅ Job marked complete!');
      closeCompleteModal();
      fetchJob();
    } catch (err) {
      console.error(err);
      toast.error('Error completing job.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  const isAssignedTech = job.accepted_by === user.id;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">🧾 Job Details</h1>

        {/* Property Card Block */}
        {job.properties && (
          <div className="mb-6">
            {job.properties.property_photo_url && (
              <img
                src={job.properties.property_photo_url}
                alt={job.properties.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <h2 className="text-lg font-semibold">{job.properties.name}</h2>
            <p className="text-sm text-gray-600">{job.properties.address}</p>
            {job.properties.directions && (
              <p className="text-sm text-gray-500 italic mt-1">{job.properties.directions}</p>
            )}
            {job.properties.notes && (
              <p className="text-sm text-gray-700 mt-2"><strong>Notes:</strong> {job.properties.notes}</p>
            )}
          </div>
        )}

        {/* Job Info Block */}
        <div className="space-y-2 text-gray-800 mb-6">
          <p><strong>Job Title:</strong> {job.title}</p>
          <p><strong>Type:</strong> {job.job_type}</p>
          <p><strong>Urgency:</strong> {job.urgency}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Scheduled:</strong> {job.scheduled_date || 'TBD'}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p className="text-sm text-gray-500">Submitted: {new Date(job.created_at).toLocaleString()}</p>
        </div>

        {/* Completion Info */}
        {job.status === 'completed' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-700">✅ Completed</h3>
            <p><strong>Date:</strong> {job.completed_at ? new Date(job.completed_at).toLocaleString() : 'N/A'}</p>
            {job.completed_notes && <p className="mt-2 whitespace-pre-line">{job.completed_notes}</p>}
            {job.job_media && job.job_media.length > 0 && (
              <div className="mt-4">
                <MediaGallery media={job.job_media} />
              </div>
            )}
          </div>
        )}

        {/* Tech/Admin Buttons */}
        {(role === 'tech' || role === 'admin') && (
          <div className="mt-6 space-y-3">
            {!job.accepted_by && (
              <button
                onClick={handleAcceptJob}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                ✅ Accept Job
              </button>
            )}
            {isAssignedTech && job.status !== 'completed' && (
              <>
                <button
                  onClick={handleRequestPart}
                  className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                >
                  🛠️ Request Part
                </button>
                <button
                  onClick={openCompleteModal}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  📸 Mark Completed
                </button>
              </>
            )}
          </div>
        )}

        {/* Tech Review Form */}
        {isAssignedTech && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Tech Notes & Completion</h2>
            <TechReviewForm jobId={id} />
          </div>
        )}

        {/* Client Review Form */}
        {(role === 'client' || role === 'admin') && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Client Feedback</h2>
            <ClientReviewForm jobId={id} />
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg relative">
            <h3 className="text-xl font-bold mb-4 text-blue-700">Complete Job</h3>
            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Completion Notes</label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={4}
                  className="w-full border rounded p-2"
                  placeholder="Add notes about the work completed..."
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Upload Photos/Videos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleCompletionFilesChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Completion Date</label>
                <input
                  type="text"
                  readOnly
                  value={new Date().toLocaleString()}
                  className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCompleteModal}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Complete Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
