// src/pages/AuthRedirectHandler.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setStatus('Unable to confirm. Please log in manually.');
        toast.error('❌ Email confirmation failed.');
        return;
      }

      const role = localStorage.getItem('turnready_role');

      if (role === 'tech') {
        navigate('/tech-setup');
      } else if (role === 'client') {
        navigate('/client-signup');
      } else {
        toast.error('❌ Role not found. Please log in.');
        navigate('/login');
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <p className="text-xl font-semibold mb-2">🔄 {status}</p>
      <p className="text-gray-500">Please wait while we complete your confirmation...</p>
    </div>
  );
};

export default AuthRedirectHandler;
