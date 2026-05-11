'use client';

import { useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/owner/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#f9f9f9' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-[#000666] to-[#1a237e]">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <h1 className="font-heading text-2xl font-bold" style={{ color: '#1a1c1c' }}>Admin Login</h1>
          <p className="text-sm mt-2" style={{ color: '#454652' }}>Sign in to manage your account</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl p-8 bg-white shadow-[0px_20px_40px_rgba(26,35,126,0.06)] space-y-5">
          {error && (
            <div className="text-sm font-medium px-4 py-3 rounded-xl" style={{ background: '#fee2e2', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1a1c1c' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition"
              style={{ background: '#eeeeee', color: '#1a1c1c' }}
              onFocus={(e) => e.target.style.background = '#ffffff'}
              onBlur={(e) => e.target.style.background = '#eeeeee'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1a1c1c' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition"
              style={{ background: '#eeeeee', color: '#1a1c1c' }}
              onFocus={(e) => e.target.style.background = '#ffffff'}
              onBlur={(e) => e.target.style.background = '#eeeeee'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm mt-8" style={{ color: '#454652' }}>
          <Link href="/" className="hover:opacity-70">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
