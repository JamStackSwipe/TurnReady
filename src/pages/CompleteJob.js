import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

const CompleteJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [job, setJob] = useState(null);
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('job_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        toast.error('Error loading job details');
      } else {
        setJob(data);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let imageUrl = null;
    if (photoFile) {
      const { data, error: uploadError } = await supabase.storage
        .from('job-photos')
        .upload(`completed/${id}/${photoFile.name}`, photoFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        toast.error('Photo upload failed');
        setSubmitting(false);
        return;
      }

      const { data: publicUrl } = supabase
        .storage
        .from('job-photos')
        .getPublicUrl(`completed/${id}/${photoFile.name}`);

      imageUrl = publicUrl.publicUrl;
    }

    const { error } = await supabase
      .from('job_submissions')
      .update({
        completed_by: user.id,
        completion_notes: notes,
        completion_photo: imageUrl,
        status: 'completed',
        completed_at: new Date(),
      })
      .eq('id', id);

    if (error) {
      toast.error('Error saving completion');
    } else {
      toast.success('✅ Job marked completed!');
      navigate('/tech-dashboard');
    }

    setSubmitting(false);
  };

  if (!job) return <div className="p-6 text-center">Loading job...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg p-6 rounded-xl">
        <h2 className="text-xl font-bold text-blue-700 mb-4">📸 Complete Job for {job.propertyName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Final Notes / Summary of Work Completed"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="w-full border p-3 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            ✅ Submit Completion
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteJob;
