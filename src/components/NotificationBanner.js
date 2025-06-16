import React from 'react';

const NotificationBanner = ({ message, type = 'info' }) => {
  const base = 'p-3 rounded text-sm mb-4';
  const types = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };
  return (
    <div className={`${base} ${types[type] || types.info}`}>
      {message}
    </div>
  );
};

export default NotificationBanner;
