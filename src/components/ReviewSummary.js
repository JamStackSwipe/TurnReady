import React from 'react';

const ReviewSummary = ({ averageRating, totalReviews }) => {
  return (
    <div className="text-sm text-gray-700">
      ⭐ {averageRating?.toFixed(1) || '0.0'} ({totalReviews || 0} reviews)
    </div>
  );
};

export default ReviewSummary;
