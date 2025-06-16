// src/components/JobList.js

import React from 'react';
import JobCard from './JobCard';

export default function JobList({ jobs = [] }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs to show.</p>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
}
