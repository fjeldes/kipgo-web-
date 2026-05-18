'use client';

import { useState, useEffect } from "react";
import { t, detectLang, type Lang } from "@/lib/i18n";

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>('en');
  useEffect(() => { setLang((localStorage.getItem('admin_lang') as Lang) || detectLang()); }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-headline font-extrabold mb-8" style={{ color: '#000666' }}>{t('landing.footer_about', lang)}</h1>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-sm leading-relaxed" style={{ color: '#454652' }}>
          <p>{t('about.p1', lang)}</p>
          <p>{t('about.p2', lang)}</p>
          <p>{t('about.p3', lang)}</p>
        </div>
        <div className="rounded-[2rem] overflow-hidden shadow-2xl">
          <img src="/images/team-meeting.png" alt="KipGo team" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
