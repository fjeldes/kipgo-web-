'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { t, detectLang, type Lang } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLang((localStorage.getItem('admin_lang') as Lang) || detectLang());
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    localStorage.setItem('admin_lang', next);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      {/* Navbar */}
      <header className="sticky top-0 w-full z-40 bg-slate-50/80 backdrop-blur-xl shadow-sm">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="KipGo" className="h-12 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#how" className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }}>{t('landing.how_it_works', lang)}</Link>
            <Link href="/#safety" className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }}>{t('landing.safety', lang)}</Link>
            <Link href="/#partners" className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }}>{t('landing.partners', lang)}</Link>
            <Link href="/faqs" className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }}>FAQ</Link>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 rounded-xl hover:bg-slate-100 transition-colors" style={{ color: '#454652' }}>
              <span className="material-symbols-outlined">language</span>
            </button>
            <Link href="/login" className="px-6 py-2.5 rounded-xl font-bold active:scale-95 transition-transform text-white" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
              {t('landing.login', lang)}
            </Link>
            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors" style={{ color: '#454652' }}>
              <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 space-y-3">
            <Link href="/#how" className="block font-medium py-2" style={{ color: '#454652' }} onClick={() => setMenuOpen(false)}>{t('landing.how_it_works', lang)}</Link>
            <Link href="/#safety" className="block font-medium py-2" style={{ color: '#454652' }} onClick={() => setMenuOpen(false)}>{t('landing.safety', lang)}</Link>
            <Link href="/#partners" className="block font-medium py-2" style={{ color: '#454652' }} onClick={() => setMenuOpen(false)}>{t('landing.partners', lang)}</Link>
            <Link href="/faqs" className="block font-medium py-2" style={{ color: '#454652' }} onClick={() => setMenuOpen(false)}>FAQ</Link>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="pt-20 pb-12 px-6" style={{ background: '#e8e8e8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="KipGo" className="h-10 w-auto" />
              </Link>
              <p className="mb-8 max-w-xs leading-relaxed" style={{ color: '#454652' }}>{t('landing.footer_desc', lang)}</p>
            </div>
            <div>
              <h4 className="font-bold mb-6" style={{ color: '#1a1c1c' }}>{t('landing.footer_company', lang)}</h4>
              <ul className="space-y-4 text-sm font-medium" style={{ color: '#454652' }}>
                <li><Link href="/about" className="hover:opacity-70 transition-colors">{t('landing.footer_about', lang)}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6" style={{ color: '#1a1c1c' }}>{t('landing.footer_support', lang)}</h4>
              <ul className="space-y-4 text-sm font-medium" style={{ color: '#454652' }}>
                <li><Link href="/faqs" className="hover:opacity-70 transition-colors">{t('landing.footer_help', lang)}</Link></li>
                <li><Link href="/contact" className="hover:opacity-70 transition-colors">{t('landing.footer_contact', lang)}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6" style={{ color: '#1a1c1c' }}>{t('landing.footer_legal', lang)}</h4>
              <ul className="space-y-4 text-sm font-medium" style={{ color: '#454652' }}>
                <li><Link href="/privacy" className="hover:opacity-70 transition-colors">{t('landing.footer_privacy', lang)}</Link></li>
                <li><Link href="/terms" className="hover:opacity-70 transition-colors">{t('landing.footer_terms', lang)}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6" style={{ color: '#1a1c1c' }}>{t('landing.footer_apps', lang)}</h4>
              <ul className="space-y-4 text-sm font-medium" style={{ color: '#454652' }}>
                <li><Link href="/login" className="hover:opacity-70 transition-colors">{t('landing.footer_partners_web', lang)}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-sm" style={{ color: '#454652' }}>{t('landing.copyright', lang)}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
