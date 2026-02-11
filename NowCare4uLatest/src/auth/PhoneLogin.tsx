import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';

const PhoneLogin: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/phone-auth/phone-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), displayName: name.trim() }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      login({ id: data.user.id, phone: data.user.phone, displayName: data.user.displayName }, data.token);
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect');
      navigate(redirect ? decodeURIComponent(redirect) : '/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h1>
        <p className="text-gray-600 mb-6">Continue with your phone number to save your health records securely.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone number</label>
            <input
              type="tel"
              placeholder="e.g. +91 90000 00000"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg shadow hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'Please wait…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PhoneLogin;
