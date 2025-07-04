import React from 'react';

const PropertyCard = ({ property, onEdit, showButtons = true }) => {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden mb-4 border border-gray-100">
      {property.property_photo_url && (
        <img
          src={property.property_photo_url}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1">{property.name}</h2>
        <p className="text-sm text-gray-600">{property.address}</p>
        {property.directions && (
          <p className="text-sm text-gray-500 italic mt-1">{property.directions}</p>
        )}
        {property.notes && (
          <p className="text-sm text-gray-700 mt-2"><strong>Notes:</strong> {property.notes}</p>
        )}
        {showButtons && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onEdit?.(property)}
              className="px-4 py-1 text-sm bg-blue-600 text-white rounded"
            >
              Edit
            </button>
            {/* Optional: Add View History */}
            {/* <button className="px-4 py-1 text-sm bg-gray-200 rounded">View History</button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
