import React from 'react';

export default function JobCard({ job }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>{job.title}</h3>
      <p><strong>Level:</strong> {job.level}</p>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>Scheduled:</strong> {job.scheduled_date || 'TBD'}</p>
      <p>{job.description}</p>
    </div>
  );
}
