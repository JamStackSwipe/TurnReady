import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useUser } from '../components/AuthProvider';

const JobUpdate = () => {
  const { user } = useUser();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [techNotes, setTechNotes] = useState('');
  const [status, setStatus] = useState('');
  const [needsPart, setNeedsPart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          properties (
            name
          )
        `)
        .eq('id', jobId)
        .single();

      if (error) {
        toast.error('Job not found');
        return;
      }

      if (data.accepted_by !== user.id) {
        toast.error('You are not assigned to this job');
        navigate('/tech-dashboard');
        return;
      }

      setJob(data);
      setStatus(data.status || '');
      setTechNotes(data.tech_notes || '');
      setLoading(false);
    };

    if (jobId) fetchJob();
  }, [jobId, user.id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('jobs')
      .update({
        tech_notes: techNotes,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    if (error) {
      toast.error('Error updating job');
      return;
    }

    toast.success('✅ Job updated');

    if (needsPart) {
      navigate(`/parts-request/${jobId}`);
    } else {
      navigate('/my-jobs');
    }

    // Optional: Notify client
    if (job?.client_id) {
      await supabase.from('notifications').insert([{
        user_id: job.client_id,
        message: `Job "${job.properties?.name || 'a job'}" was updated.`,
        job_id: jobId,
        type: 'job_update',
        seen: false,
      }]);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        🔧 Update Job: {job.properties?.name || 'Unnamed Property'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Update Notes"
          value={techNotes}
          onChange={(e) => setTechNotes(e.target.value)}
          className="w-full border rounded-lg p-3"
          rows={6}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded"
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

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          ✅ Save Update
        </button>
      </form>
    </div>
  );
};

export default JobUpdate;
