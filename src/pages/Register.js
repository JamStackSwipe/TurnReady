// src/pages/Register.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import TurnstileWrapper from '../components/TurnstileWrapper';

const SITE_KEY = "0x4AAAAAABiwQGcdykSxvgHa";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', role: ''
  });
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!form.role) {
      toast.error('Please select a role.');
      return;
    }
    if (!captchaToken) {
      toast.error('Captcha failed. Try again.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    setLoading(false);

    if (error) {
      toast.error(`Signup failed: ${error.message}`);
    } else {
      localStorage.setItem('turnready_role', form.role);
      toast.success('Signup successful — confirm via email.');
      navigate(form.role === 'tech' ? '/tech-setup' : '/client-signup');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        {/* email/password/confirm/role inputs */}
        <TurnstileWrapper
          siteKey={SITE_KEY}
          onVerify={(token) => setCaptchaToken(token)}
        />
        <button disabled={loading}>Create Account</button>
      </form>
    </div>
  );
};

export default Register;
