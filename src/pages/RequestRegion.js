// src/pages/RequestRegion.js

import React from 'react';
import RequestRegionForm from '../components/RequestRegionForm';

const RequestRegion = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">📍 Request a New Service Area</h1>
        <p className="text-gray-600 mb-6">
          Don't see your area listed? Let us know where you’d like TurnReady to expand. 
          We track requests and prioritize regions based on demand.
        </p>
        <RequestRegionForm />
      </div>
    </div>
  );
};

export default RequestRegion;
