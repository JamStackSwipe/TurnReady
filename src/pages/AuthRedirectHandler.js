import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const AuthRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        toast.error('Error confirming email.');
        navigate('/login');
        return;
      }

      const role = localStorage.getItem('turnready_role');

      if (role === 'tech') {
        navigate('/tech-setup');
      } else if (role === 'client') {
        navigate('/client-signup');
      } else {
        toast.error('No role found. Please log in.');
        navigate('/login');
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecting after confirmation...</p>
    </div>
  );
};

export default AuthRedirectHandler;
