import React from 'react';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
};

const JobStatusBadge = ({ status }) => {
  const style = statusStyles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${style}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default JobStatusBadge;
