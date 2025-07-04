// src/pages/JobDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../components/AuthProvider';
import toast from 'react-hot-toast';

import ClientReviewForm from '../components/ClientReviewForm';
import TechReviewForm from '../components/TechReviewForm';

// MediaGallery component to display job media thumbnails
const MediaGallery = ({ media }) => {
  if (!media || media.length === 0) return <p className="text-gray-500 italic">No media uploaded yet.</p>;

  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {media.map((item) => (
        <div key={item.id} className="border rounded overflow-hidden">
          {item.media_type.startsWith('image') ? (
            <img
              src={item.url}
              alt={item.description || 'Job media'}
              className="w-full h-32 object-cover"
              loading="lazy"
            />
          ) : item.media_type.startsWith('video') ? (
            <video controls className="w-full h-32 object-cover">
              <source src={item.url} type={item.media_type} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <p className="text-sm p-2">Unsupported media type</p>
          )}
          {item.description && (
            <p className="text-xs p-1 bg-gray-100 text-gray-700 truncate" title={item.description}>
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useUser();

  const [job, setJob] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    setLoading(true);
    try {
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
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Error loading job');
        console.error(error);
        setLoading(false);
        return;
      }

      setJob(data);

      // Fetch job media linked by job ID
      const { data: mediaData, error: mediaError } = await supabase
        .from('job_media')
        .select('*')
        .eq('job_id', id)
        .order('created_at', { ascending: true });

      if (mediaError) {
        console.warn('Error loading job media:', mediaError);
        setMedia([]);
      } else {
        // Map media to include public URLs
        const mediaWithUrls = mediaData.map((m) => {
          // Supabase stores only path, generate public URL
          const { publicURL } = supabase.storage.from('job-photos').getPublicUrl(m.storage_path);
          return {
            id: m.id,
            url: publicURL,
            media_type: m.media_type,
            description: m.description,
          };
        });
        setMedia(mediaWithUrls);
      }
    } catch (err) {
      toast.error('Unexpected error loading job');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const handleAcceptJob = async () => {
    if (!user) {
      toast.error('You must be logged in to accept jobs');
      return;
    }

    const { error } = await supabase
      .from('jobs')
      .update({ status: 'assigned', accepted_by: user.id })
      .eq('id', job.id);

    if (error) {
      toast.error('Failed to accept job');
      return;
    }

    toast.success('Job accepted!');
    fetchJob(); // refresh job data
  };

  const handleRequestPart = () => {
    navigate(`/parts-request/${job.id}`);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!job) return <div className="p-6 text-center">Job not found.</div>;

  const isAssignedTech = job.accepted_by === user?.id;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">🧾 Job Details</h1>

        {/* Property Card */}
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

        {/* Job Info */}
        <div className="space-y-2 text-gray-800 mb-6">
          <p><strong>Job Title:</strong> {job.title}</p>
          <p><strong>Type:</strong> {job.job_type}</p>
          <p><strong>Urgency:</strong> {job.urgency}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Scheduled:</strong> {job.scheduled_date || 'TBD'}</p>
          <p><strong>Description:</strong> {job.description}</p>
          <p className="text-sm text-gray-500">Submitted: {new Date(job.created_at).toLocaleString()}</p>
        </div>

        {/* Job Media Gallery */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">📷 Job Media</h3>
          <MediaGallery media={media} />
        </div>

        {/* Tech-only Actions */}
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
            {isAssignedTech && (
              <>
                <button
                  onClick={handleRequestPart}
                  className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                >
                  🛠️ Request Part
                </button>
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
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
    </div>
  );
};

export default JobDetails;
