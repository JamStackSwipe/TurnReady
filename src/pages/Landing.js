import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-6">
      <div className="text-center max-w-xl bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">Welcome to TurnReady</h1>
        <p className="text-gray-700 mb-6">
          TurnReady connects property owners with trusted service technicians for fast and reliable maintenance and repair work.
        </p>
        <div className="space-x-4">
          <Link to="/client-signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            I’m a Property Owner
          </Link>
          <Link to="/tech-signup" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            I’m a Technician
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
