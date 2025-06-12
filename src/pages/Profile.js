import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
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
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading profile...</p>;

  if (!profile) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>No Profile Found</h2>
        <p>Please complete your profile setup.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>👤 Profile</h1>
      <p><strong>Name:</strong> {profile.full_name || 'Not set'}</p>
      <p><strong>Email:</strong> {profile.email || 'Not available'}</p>
      <p><strong>Role:</strong> {profile.role || 'User'}</p>
      <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
      <p><strong>Bio:</strong> {profile.bio || 'No bio yet'}</p>
    </div>
  );
};

export default Profile;
