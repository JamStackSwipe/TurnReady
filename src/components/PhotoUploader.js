import React from 'react';

const PhotoUploader = ({ onChange, label = 'Upload Photo' }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  );
};

export default PhotoUploader;
