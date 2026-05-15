'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { t, detectLang, type Lang } from "@/lib/i18n";

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [showAppModal, setShowAppModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_lang') as Lang | null;
    setLang(stored || detectLang());
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    localStorage.setItem('admin_lang', next);
  };

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 w-full z-40 bg-slate-50/80 backdrop-blur-xl shadow-sm">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-3xl font-heading font-black tracking-tighter" style={{ color: '#000666', fontVariationSettings: "'FILL' 1" }}>
              shield
            </span>
            <span className="font-heading font-black tracking-tighter text-2xl" style={{ color: '#000666' }}>StashPoint</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#how">{t('landing.how_it_works', lang)}</a>
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#safety">{t('landing.safety', lang)}</a>
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#pricing">{t('landing.pricing', lang)}</a>
            <a className="font-body font-medium hover:opacity-70 transition-colors" style={{ color: '#454652' }} href="#partners">{t('landing.partners', lang)}</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleLang} className="p-2 rounded-xl hover:bg-slate-100 transition-colors" style={{ color: '#454652' }}>
              <span className="material-symbols-outlined">language</span>
            </button>
            <button onClick={() => setShowAppModal(true)} className="px-5 py-2 font-bold hover:bg-slate-100 rounded-xl transition-colors active:scale-95" style={{ color: '#000666' }}>
              {t('landing.download_app', lang)}
            </button>
            <Link href="/login" className="px-6 py-2.5 rounded-xl font-bold active:scale-95 transition-transform text-white" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
              {t('landing.login', lang)}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden pt-12 pb-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: '#ffdbcb', color: '#341100' }}>
                {t('landing.badge', lang)}
              </span>
              <h1 className="text-6xl md:text-7xl font-heading font-extrabold leading-[1.1] tracking-tight mb-8" style={{ color: '#1a1c1c' }}>
                {t('landing.hero_title_1', lang)} <span className="italic" style={{ color: '#000666' }}>{t('landing.hero_title_2', lang)}</span> {t('landing.hero_title_3', lang)}
              </h1>
              <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: '#454652' }}>
                {t('landing.hero_desc', lang)}
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setShowAppModal(true)} className="px-8 py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all flex items-center gap-2 text-white" style={{ background: '#fd6c00' }}>
                  <span className="material-symbols-outlined">search</span>
                  {t('landing.find_location', lang)}
                </button>
                <a href="#how" className="px-8 py-4 rounded-xl font-bold text-lg hover:opacity-70 transition-colors flex items-center gap-2" style={{ background: '#eeeeee', color: '#000666' }}>
                  <span className="material-symbols-outlined">play_circle</span>
                  {t('landing.see_how', lang)}
                </a>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600" />
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold" style={{ background: '#1a237e' }}>
                    +24k
                  </div>
                </div>
                <p className="text-sm font-medium italic" style={{ color: '#454652' }}>{t('landing.trust_text', lang)}</p>
              </div>
            </div>
            <div className="relative lg:h-[600px]">
              <div className="absolute inset-0 rounded-[2rem] -rotate-3 translate-x-4" style={{ background: '#e0e0ff' }} />
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center p-12">
                  <span className="text-8xl">👜</span>
                  <p className="mt-4 text-lg font-semibold" style={{ color: '#000666' }}>{t('landing.secure_storage', lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="py-24 px-6" style={{ background: '#f3f3f3' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-heading font-bold mb-4" style={{ color: '#1a1c1c' }}>{t('landing.steps_title', lang)}</h2>
              <p className="max-w-2xl mx-auto" style={{ color: '#454652' }}>{t('landing.steps_desc', lang)}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'location_on', title: t('landing.step1_title', lang), desc: t('landing.step1_desc', lang), iconBg: '#e0e0ff', iconColor: '#000666' },
                { icon: 'event_available', title: t('landing.step2_title', lang), desc: t('landing.step2_desc', lang), iconBg: '#ffdbcb', iconColor: '#9f4200' },
                { icon: 'verified_user', title: t('landing.step3_title', lang), desc: t('landing.step3_desc', lang), iconBg: '#e0e0ff', iconColor: '#000666' },
              ].map((s) => (
                <div key={s.title} className="bg-white p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(26,35,126,0.06)] transition-transform hover:-translate-y-2">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: s.iconBg }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: s.iconColor }}>{s.icon}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-4" style={{ color: '#1a1c1c' }}>{s.title}</h3>
                  <p className="leading-relaxed" style={{ color: '#454652' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="safety" className="py-24 px-6" style={{ background: '#1a237e' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
              <div className="max-w-2xl">
                <span className="font-bold uppercase tracking-[0.2em] text-xs mb-4 block" style={{ color: '#8690ee' }}>{t('landing.security_badge', lang)}</span>
                <h2 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight text-white">{t('landing.security_title', lang)}</h2>
              </div>
              <a href="#safety-features" className="px-8 py-4 bg-white rounded-xl font-bold hover:opacity-90 transition-colors" style={{ color: '#000666' }}>
                {t('landing.security_certs', lang)}
              </a>
            </div>
            <div id="safety-features" className="grid md:grid-cols-3 rounded-[2rem] overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { icon: 'health_and_safety', title: t('landing.sec1_title', lang), desc: t('landing.sec1_desc', lang) },
                { icon: 'nest_cam_outdoor', title: t('landing.sec2_title', lang), desc: t('landing.sec2_desc', lang) },
                { icon: 'qr_code_scanner', title: t('landing.sec3_title', lang), desc: t('landing.sec3_desc', lang) },
              ].map((s) => (
                <div key={s.title} className="p-12 flex flex-col items-center text-center" style={{ background: '#1a237e' }}>
                  <span className="material-symbols-outlined text-6xl mb-8" style={{ color: '#8690ee', fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  <h3 className="text-2xl font-heading font-bold mb-4 text-white">{s.title}</h3>
                  <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="partners" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-[0px_20px_40px_rgba(26,35,126,0.06)]">
            <div className="p-12 lg:p-20 lg:w-1/2 flex flex-col justify-center">
              <h2 className="text-4xl font-heading font-extrabold mb-8 leading-tight" style={{ color: '#1a1c1c' }}>{t('landing.partner_title', lang)}</h2>
              <ul className="space-y-6 mb-12">
                {[
                  { icon: 'payments', title: t('landing.partner1_title', lang), desc: t('landing.partner1_desc', lang) },
                  { icon: 'group', title: t('landing.partner2_title', lang), desc: t('landing.partner2_desc', lang) },
                  { icon: 'support_agent', title: t('landing.partner3_title', lang), desc: t('landing.partner3_desc', lang) },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="material-symbols-outlined p-1 rounded-lg flex-shrink-0" style={{ background: '#ffdbcb', color: '#9f4200' }}>{item.icon}</span>
                    <div>
                      <strong className="block text-lg" style={{ color: '#1a1c1c' }}>{item.title}</strong>
                      <p style={{ color: '#454652' }}>{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowAppModal(true)} className="px-10 py-5 rounded-2xl font-bold text-xl hover:brightness-110 transition-all self-start active:scale-95 text-white" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                {t('landing.become_partner', lang)}
              </button>
            </div>
            <div className="lg:w-1/2 min-h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
              <div className="text-center p-12">
                <span className="text-8xl">🏪</span>
                <p className="mt-4 text-lg font-semibold" style={{ color: '#000666' }}>{t('landing.store_extra_income', lang)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download App Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="rounded-[3rem] p-16 text-center text-white" style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
            <span className="material-symbols-outlined text-6xl mb-6" style={{ color: '#8690ee', fontVariationSettings: "'FILL' 1" }}>phone_iphone</span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">{t('landing.download_title', lang)}</h2>
            <p className="text-lg max-w-xl mx-auto mb-10 opacity-80">{t('landing.download_desc', lang)}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-2xl">apple</span>
                <div className="text-left">
                  <p className="text-[10px] opacity-60 font-normal">{t('landing.download_from', lang)}</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </a>
              <a href="#" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-2xl">play_store</span>
                <div className="text-left">
                  <p className="text-[10px] opacity-60 font-normal">{t('landing.download_from', lang)}</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="pt-20 pb-12 px-6" style={{ background: '#e8e8e8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-2xl" style={{ color: '#000666', fontVariationSettings: "'FILL' 1" }}>shield</span>
                <span className="font-heading font-black tracking-tighter text-xl" style={{ color: '#000666' }}>StashPoint</span>
              </div>
              <p className="mb-8 max-w-xs leading-relaxed" style={{ color: '#454652' }}>{t('landing.footer_desc', lang)}</p>
              <div className="flex gap-4">
                {['public', 'share', 'mail'].map((icon) => (
                  <a key={icon} href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: '#e2e2e2', color: '#000666' }}>
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
            {[
              { title: t('landing.footer_company', lang), items: [
                { label: t('landing.footer_about', lang), href: '/about' },
                { label: t('landing.footer_careers', lang), href: '/' },
                { label: t('landing.footer_press', lang), href: '/' },
                { label: t('landing.footer_blog', lang), href: '/' },
              ]},
              { title: t('landing.footer_support', lang), items: [
                { label: t('landing.footer_help', lang), href: '/contact' },
                { label: t('landing.footer_safety', lang), href: '/#safety' },
                { label: t('landing.footer_contact', lang), href: '/contact' },
                { label: t('landing.footer_dropoff', lang), href: '#', onClick: () => setShowAppModal(true) },
              ]},
              { title: t('landing.footer_legal', lang), items: [
                { label: t('landing.footer_privacy', lang), href: '/privacy' },
                { label: t('landing.footer_terms', lang), href: '/terms' },
                { label: t('landing.footer_cookies', lang), href: '/privacy' },
                { label: t('landing.footer_insurance', lang), href: '/' },
              ]},
              { title: t('landing.footer_apps', lang), items: [
                { label: t('landing.footer_ios', lang), href: '#', onClick: () => setShowAppModal(true) },
                { label: t('landing.footer_android', lang), href: '#', onClick: () => setShowAppModal(true) },
                { label: t('landing.footer_partners_web', lang), href: '/login' },
              ]},
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold mb-6" style={{ color: '#1a1c1c' }}>{col.title}</h4>
                <ul className="space-y-4 text-sm font-medium" style={{ color: '#454652' }}>
                  {col.items.map((item) => (
                    <li key={item.label}>
                      {item.onClick ? (
                        <button onClick={item.onClick} className="hover:opacity-70 transition-colors text-left">{item.label}</button>
                      ) : (
                        <a href={item.href} className="hover:opacity-70 transition-colors">{item.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-sm" style={{ color: '#454652' }}>{t('landing.copyright', lang)}</p>
            <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {t('landing.system_online', lang)}</span>
              <span className="flex items-center gap-2">AES-256 Protocol</span>
            </div>
          </div>
        </div>
      </footer>

      {/* App Download Modal */}
      {showAppModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowAppModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,6,102,0.05)' }}>
              <span className="material-symbols-outlined text-3xl" style={{ color: '#000666' }}>phone_iphone</span>
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2" style={{ color: '#000666' }}>{t('landing.download_title', lang)}</h3>
            <p className="text-sm mb-6" style={{ color: '#454652' }}>{t('landing.download_modal_desc', lang)}</p>
            <div className="flex flex-col gap-3">
              <a href="#" className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2" style={{ background: '#000666' }}>
                <span className="material-symbols-outlined">apple</span>
                App Store
              </a>
              <a href="#" className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2" style={{ background: '#000666' }}>
                <span className="material-symbols-outlined">play_store</span>
                Google Play
              </a>
            </div>
            <button onClick={() => setShowAppModal(false)} className="mt-4 text-sm font-medium hover:underline" style={{ color: '#767683' }}>
              {t('common.cancel', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
