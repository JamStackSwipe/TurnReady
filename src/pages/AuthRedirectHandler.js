// src/pages/Confirm.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const Confirm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmAndRedirect = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error('❌ Confirmation failed or session expired.');
        navigate('/login');
        return;
      }

      toast.success('✅ Email confirmed!');

      const role = localStorage.getItem('turnready_role');

      if (role === 'tech') {
        navigate('/tech-setup');
      } else if (role === 'client') {
        navigate('/client-signup');
      } else {
        navigate('/choose-role');
      }
    };

    confirmAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-blue-700">⏳ Finalizing your signup...</h2>
        <p className="text-sm text-gray-600 mt-2">Just a moment...</p>
      </div>
    </div>
  );
};

export default Confirm;
