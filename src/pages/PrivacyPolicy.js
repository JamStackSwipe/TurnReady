// src/pages/PrivacyPolicy.js

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen p-6 bg-white text-gray-800 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🔒 Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. Here's how we handle your information:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>We collect your contact and job-related information to provide our services.</li>
        <li>We do not sell or share your personal data with third parties.</li>
        <li>All payment transactions are processed securely through trusted third-party providers.</li>
        <li>Technicians and clients may communicate via the platform, but phone/email is only visible after job acceptance.</li>
        <li>You may request account deletion at any time by contacting support.</li>
      </ul>
      <p className="mt-6 text-sm text-gray-500">
        Updated: June 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;
