'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { t, detectLang, type Lang } from "@/lib/i18n";

const Content = ({ lang }: { lang: Lang }) => (
  <>
    <h3 className="text-lg font-bold mt-8" style={{ color: '#000666' }}>1. {t('terms.h1', lang)}</h3>
    <p>{t('terms.p1', lang)}</p>
    <h3 className="text-lg font-bold mt-8" style={{ color: '#000666' }}>2. {t('terms.h2', lang)}</h3>
    <p>{t('terms.p2', lang)}</p>
    <h3 className="text-lg font-bold mt-8" style={{ color: '#000666' }}>3. {t('terms.h3', lang)}</h3>
    <p>{t('terms.p3', lang)}</p>
    <h3 className="text-lg font-bold mt-8" style={{ color: '#000666' }}>4. {t('terms.h4', lang)}</h3>
    <p>{t('terms.p4', lang)}</p>
    <h3 className="text-lg font-bold mt-8" style={{ color: '#000666' }}>5. {t('terms.h5', lang)}</h3>
    <p>{t('terms.p5', lang)}</p>
  </>
);

export default function TermsPage() {
  const [lang, setLang] = useState<Lang>('en');
  useEffect(() => { setLang((localStorage.getItem('admin_lang') as Lang) || detectLang()); }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm font-bold hover:underline mb-8 inline-block" style={{ color: '#000666' }}>← {t('common.back', lang)}</Link>
        <h1 className="text-4xl font-headline font-extrabold mb-6" style={{ color: '#000666' }}>{t('landing.footer_terms', lang)}</h1>
        <div className="space-y-4 text-sm leading-relaxed" style={{ color: '#454652' }}>
          <Content lang={lang} />
        </div>
      </div>
    </div>
  );
}
