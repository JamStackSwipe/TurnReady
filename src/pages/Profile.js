import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('Not logged in.');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        toast.error('Profile not found.');
        setLoading(false);
        return;
      }

      setProfile(data);

      // 🚀 Auto-redirect if role is already set
      if (data.role === 'tech') {
        navigate('/tech-dashboard');
      } else if (data.role === 'client') {
        navigate('/client-dashboard');
      } else {
        setLoading(false); // Role not set yet, show picker
      }
    }

    loadProfile();
  }, [navigate]);

  const assignRole = async (role) => {
    if (!profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', profile.id);

    if (error) {
      toast.error('Error setting role.');
      return;
    }

    toast.success(`Role set to ${role}`);

    if (role === 'tech') {
      navigate('/tech-setup');
    } else {
      navigate('/client-signup');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading profile...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-4">👤 Welcome to TurnReady</h1>
        <p className="mb-6">Please select your role to complete setup:</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => assignRole('tech')}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            I am a Technician
          </button>
          <button
            onClick={() => assignRole('client')}
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            I am a Property Owner / Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
