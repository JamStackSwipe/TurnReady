// src/components/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const currentUser = userData?.user;

        if (userError) {
          console.error('User fetch error:', userError.message);
        }

        if (currentUser) {
          setUser(currentUser);

          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle(); // ✅ safer than .single()

          if (profileError) {
            console.warn('Profile fetch error:', profileError.message);
          }

          if (profileData) {
            setProfile(profileData);
          } else {
            console.warn('No profile found for user:', currentUser.id);
          }
        }
      } catch (err) {
        console.error('AuthProvider fatal error:', err.message);
      } finally {
        setLoading(false); // ✅ Always clear loading
      }
    };

    fetchSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user || null;
      setUser(newUser);
      setProfile(null);
      if (newUser) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', newUser.id)
          .maybeSingle() // ✅ same here
          .then(({ data, error }) => {
            if (error) console.error('Profile reload error:', error.message);
            if (data) setProfile(data);
          });
      }
    });

    return () => listener?.subscription?.unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-600 text-lg">🔄 Loading profile...</div>;
  }

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
