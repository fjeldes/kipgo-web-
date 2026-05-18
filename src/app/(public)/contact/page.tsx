'use client';

import { useState, useEffect } from "react";
import { t, detectLang, type Lang } from "@/lib/i18n";

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>('en');
  useEffect(() => { setLang((localStorage.getItem('admin_lang') as Lang) || detectLang()); }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-headline font-extrabold mb-8" style={{ color: '#000666' }}>{t('landing.footer_contact', lang)}</h1>
      <div className="grid gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#000666' }}>{t('common.email', lang)}</h2>
          <a href="mailto:support@kipgo.app" className="text-sm hover:underline" style={{ color: '#454652' }}>support@kipgo.app</a>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#000666' }}>{t('profile.support', lang)}</h2>
          <p className="text-sm" style={{ color: '#454652' }}>{t('contact.support_desc', lang)}</p>
        </div>
      </div>
    </div>
  );
}
