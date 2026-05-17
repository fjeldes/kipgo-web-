'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { t, useLang } from "@/lib/i18n";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPromoPage() {
  const { token } = useAuth();
  const lang = useLang();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    maxUses: '1',
    expiresAt: '',
    minBookingAmount: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.code.trim()) errs.code = t('promo.error_required', lang);
    if (!form.discountValue || Number(form.discountValue) <= 0) errs.discountValue = t('promo.error_positive', lang);
    if (form.discountType === 'percentage' && Number(form.discountValue) > 100) errs.discountValue = t('promo.error_max100', lang);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;
    setLoading(true);
    try {
      await api.post('/promos', {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxUses: form.maxUses ? Number(form.maxUses) : 1,
        expiresAt: form.expiresAt || undefined,
        minBookingAmount: form.minBookingAmount ? Number(form.minBookingAmount) : undefined,
      }, token);
      toast('success', t('promo.created', lang));
      router.push('/super/promos');
    } catch (e: any) {
      toast('error', e.message || t('promo.error_create', lang));
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: string, opts?: { type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: '#454652' }}>{label}</label>
      <input
        type={opts?.type || 'text'}
        value={(form as any)[key] || ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={opts?.placeholder}
        className={`w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 px-4 text-sm outline-none transition ${errors[key] ? 'ring-2 ring-red-300' : ''}`}
        style={{ color: '#1a1c1c' }}
      />
      {errors[key] && <p className="text-[10px] mt-1 text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/super/promos" className="p-2 rounded-xl hover:bg-white transition-colors" style={{ color: '#454652' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>{t('promo.create', lang)}</h2>
          <p className="text-sm mt-1" style={{ color: '#454652' }}>{t('promo.create_subtitle', lang)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field(t('promo.code', lang), 'code', { placeholder: t('promo.code_placeholder', lang) })}

          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: '#454652' }}>{t('promo.discount_type', lang)}</label>
            <select
              value={form.discountType}
              onChange={(e) => setForm({ ...form, discountType: e.target.value })}
              className="w-full bg-[#f3f3f3] border-none rounded-xl py-2.5 px-4 text-sm outline-none"
              style={{ color: '#1a1c1c' }}
            >
              <option value="percentage">{t('promo.percentage', lang)}</option>
              <option value="fixed">{t('promo.fixed', lang)}</option>
            </select>
          </div>

          {field(form.discountType === 'percentage' ? t('promo.discount_percent', lang) : t('promo.discount_fixed', lang), 'discountValue', { type: 'number', placeholder: '10' })}
          {field(t('promo.max_uses', lang), 'maxUses', { type: 'number', placeholder: '1' })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field(t('promo.expires_at', lang), 'expiresAt', { type: 'date' })}
          {field(t('promo.min_amount', lang), 'minBookingAmount', { type: 'number', placeholder: '0' })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 hover:brightness-110 transition-all"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
        >
          {loading ? t('common.creating', lang) : t('promo.create_btn', lang)}
        </button>
      </form>
    </div>
  );
}
