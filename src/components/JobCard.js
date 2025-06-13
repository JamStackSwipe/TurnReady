import React from 'react';

export default function JobCard({ job }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ margin: 0 }}>{job.title}</h2>
      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
        <span><strong>Level:</strong> {job.level}</span> &nbsp;|&nbsp;
        <span><strong>Status:</strong> {job.status}</span> &nbsp;|&nbsp;
        <span><strong>Scheduled:</strong> {job.scheduled_date || 'TBD'}</span>
      </div>
      <p>{job.description}</p>
    </div>
  );
}
