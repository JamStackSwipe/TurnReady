import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('No user session found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading profile...</p>;

  if (!profile) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>👤 Profile</h1>
        <p>No profile found. Please create one.</p>
        <p>
          <Link to="/signup/tech" style={{ color: '#2563eb' }}>
            Create Tech Profile
          </Link>{' '}
          or{' '}
          <Link to="/signup/client" style={{ color: '#2563eb' }}>
            Sign Up as a Client
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👤 Profile</h1>
      <p><strong>Name:</strong> {profile.full_name || 'Not set'}</p>
      <p><strong>Email:</strong> {profile.email || 'Not available'}</p>
      <p><strong>Role:</strong> {profile.role || 'Unassigned'}</p>
    </div>
  );
};

export default Profile;
