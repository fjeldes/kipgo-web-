'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { t, detectLang, type Lang } from "@/lib/i18n";

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>('en');
  useEffect(() => { setLang((localStorage.getItem('admin_lang') as Lang) || detectLang()); }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm font-bold hover:underline mb-8 inline-block" style={{ color: '#000666' }}>← {t('common.back', lang)}</Link>
        <h1 className="text-4xl font-headline font-extrabold mb-6" style={{ color: '#000666' }}>{t('landing.footer_contact', lang)}</h1>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined text-2xl mb-3" style={{ color: '#000666' }}>mail</span>
            <p className="font-bold text-sm" style={{ color: '#000666' }}>{t('landing.footer_contact', lang)}</p>
            <p className="text-sm mt-1" style={{ color: '#454652' }}>contacto@kipgo.app</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <span className="material-symbols-outlined text-2xl mb-3" style={{ color: '#000666' }}>support_agent</span>
            <p className="font-bold text-sm" style={{ color: '#000666' }}>{t('landing.footer_support', lang)}</p>
            <p className="text-sm mt-1" style={{ color: '#454652' }}>{t('contact.support_desc', lang)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
