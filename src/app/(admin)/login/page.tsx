'use client';

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { t, detectLang, type Lang } from "@/lib/i18n";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLang((localStorage.getItem('admin_lang') as Lang) || detectLang());
  }, []);

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
        router.push(isAdmin ? '/super' : '/owner/dashboard');
        return;
      }
      router.push('/owner/dashboard');
    } catch (err: any) {
      setError(err.message || t('login.invalid_credentials', lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-stretch overflow-hidden bg-[#f9f9f9]">
      {/* Left Side */}
      <section className="hidden lg:flex lg:w-3/5 xl:w-[65%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 opacity-90" />
        <div className="relative z-10 flex flex-col justify-between p-16 w-full h-full">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto brightness-0 invert" />
            <button onClick={() => { const next = lang === 'en' ? 'es' : 'en'; setLang(next); localStorage.setItem('admin_lang', next); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white/70 hover:text-white border border-white/20 hover:border-white/40 transition-colors">
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
          </div>
          <div className="max-w-xl">
            <h2 className="text-white text-4xl md:text-5xl font-headline font-extrabold leading-tight mb-6">
              {t('login.hero_title', lang)}
            </h2>
            <p className="text-blue-200 text-lg md:text-xl font-body leading-relaxed max-w-lg">
              {t('login.hero_desc', lang)}
            </p>
          </div>
          <div className="text-white/40 text-xs">
            &copy; 2026 KipGo.
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-2/5 xl:w-[35%] bg-[#f9f9f9] flex flex-col justify-center px-8 sm:px-16 lg:px-12 xl:px-20 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-extrabold" style={{ color: '#1a237e' }}>{t('login.title', lang)}</h1>
            <p className="font-body text-sm" style={{ color: '#454652' }}>{t('login.subtitle', lang)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm font-medium px-4 py-3 rounded-xl" style={{ background: '#ffdad6', color: '#93000a' }}>
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider ml-1" style={{ color: '#454652' }} htmlFor="email">{t('login.email', lang)}</label>
              <div className="relative">
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('login.email_placeholder', lang)} required
                  className="w-full border-none rounded-xl py-3.5 pl-11 pr-4 text-sm transition-all placeholder:opacity-40 outline-none"
                  style={{ background: '#eeeeee', color: '#1a1c1c' }}
                  onFocus={(e) => e.target.style.background = '#ffffff'}
                  onBlur={(e) => e.target.style.background = '#eeeeee'} />
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#c6c5d4' }}>mail</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: '#454652' }} htmlFor="password">{t('login.password', lang)}</label>
                <a className="text-xs font-semibold hover:underline" style={{ color: '#000666' }} href="#">{t('login.forgot', lang)}</a>
              </div>
              <div className="relative">
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full border-none rounded-xl py-3.5 pl-11 pr-4 text-sm transition-all placeholder:opacity-40 outline-none"
                  style={{ background: '#eeeeee', color: '#1a1c1c' }}
                  onFocus={(e) => e.target.style.background = '#ffffff'}
                  onBlur={(e) => e.target.style.background = '#eeeeee'} />
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#c6c5d4' }}>lock</span>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
              {loading ? t('login.signing_in', lang) : t('login.sign_in', lang)}
            </button>
          </form>

          <p className="text-center text-xs leading-relaxed max-w-[280px] mx-auto" style={{ color: 'rgba(69,70,82,0.5)' }}>
            {t('login.disclaimer', lang)}
          </p>
        </div>
      </section>
    </main>
  );
}
