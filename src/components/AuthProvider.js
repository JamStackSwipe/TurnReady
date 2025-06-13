// src/components/AuthProvider.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // ✅ new
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const currentUser = userData?.user;

      if (currentUser) {
        setUser(currentUser);

        // ✅ Load profile from Supabase 'profiles' table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else {
          console.warn('No profile found:', profileError?.message);
        }
      }

      setLoading(false);
    };

    fetchSessionAndProfile();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user || null;
      setUser(newUser);
      setProfile(null); // Clear until reloaded
      if (newUser) {
        // Fetch profile again
        supabase
          .from('profiles')
          .select('*')
          .eq('id', newUser.id)
          .single()
          .then(({ data }) => setProfile(data))
          .catch((err) => console.error('Profile reload error:', err.message));
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  return context;
};
