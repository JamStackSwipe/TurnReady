import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error('Error resetting password.');
    } else {
      toast.success('Password updated!');
      setSubmitted(true);
    }
  };

  useEffect(() => {
    const type = searchParams.get('type');
    if (type !== 'recovery') {
      toast.error('Invalid recovery link');
    }
  }, []);

  if (submitted) return <p>Password updated. You may now log in.</p>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🔐 Reset Password</h1>
      <input
        type="password"
        placeholder="New Password"
        className="w-full border rounded p-2 mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleReset}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
