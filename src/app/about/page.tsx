'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { t, detectLang, type Lang } from "@/lib/i18n";

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>('en');
  useEffect(() => { setLang((localStorage.getItem('admin_lang') as Lang) || detectLang()); }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm font-bold hover:underline mb-8 inline-block" style={{ color: '#000666' }}>← {t('common.back', lang)}</Link>
        <h1 className="text-4xl font-headline font-extrabold mb-6" style={{ color: '#000666' }}>{t('landing.footer_about', lang)}</h1>
        <div className="prose max-w-none space-y-4 text-sm leading-relaxed" style={{ color: '#454652' }}>
          <p>{t('about.p1', lang)}</p>
          <p>{t('about.p2', lang)}</p>
          <p>{t('about.p3', lang)}</p>
        </div>
      </div>
    </div>
  );
}
