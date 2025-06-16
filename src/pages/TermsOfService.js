// src/pages/TermsOfService.js

import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-800 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📜 Terms of Service</h1>
      <p className="mb-4">
        Welcome to TurnReady. By using our platform, you agree to the following terms:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>You must be 18 years or older to use this service.</li>
        <li>All job postings must be accurate and truthful.</li>
        <li>Technicians must maintain all required licenses and insurance.</li>
        <li>We reserve the right to suspend accounts that violate these terms.</li>
        <li>Payments are non-refundable once a technician has accepted a job and started work.</li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">
        Updated: June 2025
      </p>
    </div>
  );
};

export default TermsOfService;
