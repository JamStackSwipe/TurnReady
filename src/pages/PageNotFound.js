import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-4">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="text-blue-600 hover:underline font-semibold"
      >
        ← Go Back Home
      </Link>
    </div>
  );
};

export default PageNotFound;
