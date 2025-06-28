import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validLink, setValidLink] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setValidLink(true);
    } else {
      toast.error('Invalid or expired reset link.');
      navigate('/');
    }
  }, [searchParams, navigate]);

  const handleReset = async () => {
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error('Error resetting password.');
    } else {
      toast.success('✅ Password updated! You may now log in.');
      setSubmitted(true);
    }
  };

  if (!validLink) return null;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
          🔐 Reset Your Password
        </h1>

        {submitted ? (
          <div className="text-center text-green-600">
            <p className="mb-4">Your password has been updated.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded p-3 mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleReset}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
