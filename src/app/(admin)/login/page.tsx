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
      const stored = localStorage.getItem('admin_auth');
      if (stored) {
        const user = JSON.parse(stored).user;
        if (user?.mustChangePassword) {
          router.push('/change-password');
          return;
        }
        const isAdmin = user.roles?.includes('admin');
        router.push(isAdmin ? '/super/payouts' : '/owner/dashboard');
        return;
      }
      router.push('/owner/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-stretch overflow-hidden bg-[#f9f9f9]">
      {/* Left Side: Visual Narrative */}
      <section className="hidden lg:flex lg:w-3/5 xl:w-[65%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 opacity-90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto brightness-0 invert" />
            </div>
          <div className="max-w-xl">
            <h2 className="text-white text-5xl font-headline font-extrabold leading-tight mb-6">
              Architecting the Future <br/>of Asset Protection.
            </h2>
            <p className="text-blue-200 text-xl font-body leading-relaxed max-w-lg">
              Manage your facility with the precision of a digital concierge. Secure, scalable, and built for professional store owners.
            </p>
            <div className="mt-12 flex space-x-12">
              <div className="flex flex-col">
                <span className="text-white text-3xl font-headline font-bold">99.9%</span>
                <span className="text-blue-200 text-sm font-label uppercase tracking-widest mt-1">Uptime SLA</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-3xl font-headline font-bold">ISO 27001</span>
                <span className="text-blue-200 text-sm font-label uppercase tracking-widest mt-1">Certified</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-white/60 text-sm">
            <span>&copy; 2026 KipGo.</span>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-2/5 xl:w-[35%] bg-[#f9f9f9] flex flex-col justify-center px-8 sm:px-16 lg:px-12 xl:px-20 py-12">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-3">
            <h1 className="text-3xl font-headline font-extrabold" style={{ color: '#1a237e' }}>Owner Access</h1>
            <p className="font-body" style={{ color: '#454652' }}>Sign in to the partner portal to manage your units and inventory.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-sm font-medium px-4 py-3 rounded-xl" style={{ background: '#ffdad6', color: '#93000a' }}>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-label font-bold uppercase tracking-wider ml-1" style={{ color: '#454652' }} htmlFor="email">Business Credentials</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@centralstation.com"
                  required
                  className="w-full border-none rounded-2xl py-4 pl-12 pr-4 transition-all placeholder:opacity-50 outline-none"
                  style={{ background: '#eeeeee', color: '#1a1c1c' }}
                  onFocus={(e) => e.target.style.background = '#ffffff'}
                  onBlur={(e) => e.target.style.background = '#eeeeee'}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#c6c5d4' }}>mail</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-label font-bold uppercase tracking-wider" style={{ color: '#454652' }} htmlFor="password">Security Code</label>
                <a className="text-xs font-label font-semibold" style={{ color: '#000666' }} href="#">Forgot Key?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-none rounded-2xl py-4 pl-12 pr-4 transition-all placeholder:opacity-50 outline-none"
                  style={{ background: '#eeeeee', color: '#1a1c1c' }}
                  onFocus={(e) => e.target.style.background = '#ffffff'}
                  onBlur={(e) => e.target.style.background = '#eeeeee'}
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#c6c5d4' }}>lock</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-10 h-6 rounded-full peer-checked:bg-[#fd6c00] transition-colors" style={{ background: '#e8e8e8' }} />
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="ml-3 text-sm font-body transition-colors group-hover:opacity-80" style={{ color: '#454652' }}>Persistent Session</span>
              </label>
              <div className="flex items-center px-3 py-1.5 rounded-full" style={{ background: '#f3f3f3' }}>
                <span className="material-symbols-outlined text-[16px] mr-1.5" style={{ color: '#fd6c00', fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: '#454652' }}>Encrypted</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 px-6 rounded-3xl font-headline font-bold text-lg transition-all duration-300 active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', boxShadow: '0px 10px 30px rgba(26,35,126,0.15)' }}
            >
              {loading ? 'Signing in...' : 'Partner Portal Login'}
            </button>
          </form>

          <div className="pt-8 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-px flex-1" style={{ background: '#eeeeee' }} />
              <span className="text-xs font-label uppercase tracking-widest" style={{ color: '#767683' }}>Support</span>
              <div className="h-px flex-1" style={{ background: '#eeeeee' }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border rounded-2xl hover:opacity-80 transition-colors group" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
                <span className="material-symbols-outlined transition-colors" style={{ color: '#454652' }}>help_center</span>
                <span className="text-sm font-semibold" style={{ color: '#454652' }}>Support Hub</span>
              </button>
              <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-white border rounded-2xl hover:opacity-80 transition-colors group" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
                <span className="material-symbols-outlined transition-colors" style={{ color: '#454652' }}>add_business</span>
                <span className="text-sm font-semibold" style={{ color: '#454652' }}>Apply Now</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs leading-relaxed max-w-[280px] mx-auto pt-4" style={{ color: 'rgba(69,70,82,0.6)' }}>
            By logging in, you acknowledge that you are accessing a secure private network. Unauthorized access is strictly prohibited.
          </p>
        </div>
      </section>

      {/* Floating Security Chip */}
      <div className="fixed bottom-8 right-8 hidden lg:flex items-center space-x-3 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0px_20px_40px_rgba(26,35,126,0.06)] border border-white/20">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1a237e' }}>System Secured • Tokyo-01</span>
      </div>
    </main>
  );
}
