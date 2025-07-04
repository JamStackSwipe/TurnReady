// src/components/MediaGallery.js
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const MediaGallery = ({ jobId }) => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from('job_media') // or 'job_photos' depending on your schema
        .select('*')
        .eq('job_id', jobId);

      if (error) {
        console.error('Failed to load media:', error.message);
      } else {
        setMedia(data || []);
      }
    };

    if (jobId) fetchMedia();
  }, [jobId]);

  if (!media.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">📸 Uploaded Media</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <a
            key={item.id}
            href={item.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            {item.media_type === 'video/mp4' ? (
              <video
                src={item.media_url}
                controls
                className="w-full h-32 object-cover rounded-lg shadow"
              />
            ) : (
              <img
                src={item.media_url}
                alt={item.label || 'Uploaded Media'}
                className="w-full h-32 object-cover rounded-lg shadow group-hover:opacity-80"
              />
            )}
            {item.label && (
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {item.label}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
