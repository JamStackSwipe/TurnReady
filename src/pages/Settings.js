import React from 'react';
import { useUser } from '../components/AuthProvider';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useUser();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out');
    } else {
      toast.success('Logged out');
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">⚙️ Settings</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Account Info</h2>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Danger Zone</h2>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
