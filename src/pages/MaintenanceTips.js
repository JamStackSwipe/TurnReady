// src/pages/MaintenanceTips.js

import React from 'react';

const tips = [
  {
    title: '🌀 Change Air Filters Monthly',
    description: 'Dirty filters reduce airflow and efficiency. Swap them out every 30 days, especially in rentals.',
  },
  {
    title: '🔌 Check Thermostat Batteries',
    description: 'Low batteries can cause systems to fail. Swap them every 6 months to prevent no-cool calls.',
  },
  {
    title: '🌬️ Keep Vents Unblocked',
    description: 'Ensure furniture and rugs are not blocking air vents to maintain airflow and comfort.',
  },
  {
    title: '🌧️ Clear Outdoor Unit',
    description: 'Remove leaves, grass, and debris from around the outdoor condenser. Keep 2ft clearance.',
  },
  {
    title: '🚿 Flush Water Heaters Yearly',
    description: 'Sediment buildup reduces efficiency. Schedule a drain/flush service each year.',
  },
  {
    title: '🛑 Avoid DIY Refrigerant Work',
    description: 'It’s illegal and dangerous to handle refrigerant without proper certification. Call a pro.',
  },
];

const MaintenanceTips = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-4">🧰 Maintenance Tips</h1>
        <p className="text-gray-600 mb-6">
          A little maintenance goes a long way. These simple steps can help avoid costly repairs and keep your equipment running smoothly.
        </p>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="bg-gray-50 border p-4 rounded shadow-sm">
              <h2 className="font-semibold text-lg text-gray-800">{tip.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTips;
