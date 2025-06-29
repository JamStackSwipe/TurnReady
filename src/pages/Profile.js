import React from 'react';
import { useUser } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, profile } = useUser();
  const navigate = useNavigate();

  if (!user || !profile) {
    return (
      <div className="p-6 text-center text-gray-500">
        🔐 Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">👤 My Profile</h1>

      <div className="space-y-4 bg-white p-4 rounded shadow">
        <div><strong>Full Name:</strong> {profile.full_name || 'Not provided'}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Phone:</strong> {profile.phone || 'Not provided'}</div>
        <div><strong>Role:</strong> {profile.role || 'Unspecified'}</div>
        <div><strong>Address:</strong> {profile.address || 'Not provided'}</div>
        <div>
          <strong>Onboarding Complete:</strong>{' '}
          {profile.onboarding_complete ? '✅ Yes' : '❌ No'}
        </div>
      </div>

      {/* ✅ Add onboarding button if not complete */}
      {!profile.onboarding_complete && (
        <div className="mt-4 text-center">
          <p className="text-red-600 font-semibold">⚠️ Your onboarding is not complete.</p>
          <button
            onClick={() =>
              navigate(profile.role === 'tech' ? '/techsignup' : '/client-signup')
            }
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🚀 Complete Onboarding Now
          </button>
        </div>
      )}

      {profile.role === 'tech' && (
        <div className="mt-6">
          <button
            onClick={() => navigate('/tech-dashboard')}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            🚚 Go to Tech Dashboard
          </button>
        </div>
      )}

      {profile.role === 'client' && (
        <div className="mt-6">
          <button
            onClick={() => navigate('/client-dashboard')}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            🏡 Go to Client Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
