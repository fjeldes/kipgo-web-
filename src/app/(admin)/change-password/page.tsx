'use client';

import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChangePasswordPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!currentPassword) { setError('Current password is required'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.patch('/auth/password', { currentPassword, newPassword }, token || undefined);
      localStorage.removeItem('admin_auth');
      alert('Password changed successfully. Please login again.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Could not change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-headline text-2xl font-bold" style={{ color: '#1a1c1c' }}>Change Password</h1>
          <p className="text-sm mt-2" style={{ color: '#454652' }}>Set a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.06)] space-y-5">
          {error && <div className="text-sm font-medium px-4 py-3 rounded-xl bg-red-50 text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1a1c1c' }}>Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition" style={{ background: '#eeeeee', color: '#1a1c1c' }}
              onFocus={(e) => e.target.style.background = '#ffffff'} onBlur={(e) => e.target.style.background = '#eeeeee'} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1a1c1c' }}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition" style={{ background: '#eeeeee', color: '#1a1c1c' }}
              onFocus={(e) => e.target.style.background = '#ffffff'} onBlur={(e) => e.target.style.background = '#eeeeee'} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1a1c1c' }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat new password" required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition" style={{ background: '#eeeeee', color: '#1a1c1c' }}
              onFocus={(e) => e.target.style.background = '#ffffff'} onBlur={(e) => e.target.style.background = '#eeeeee'} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
