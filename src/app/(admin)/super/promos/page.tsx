'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { EmptyState } from "@/components/ui/EmptyState";
import { t, useLang } from "@/lib/i18n";

export default function PromosPage() {
  const { token } = useAuth();
  const lang = useLang();
  const toast = useToast();
  const router = useRouter();

  const { data: promos, loading, error, refetch } = useAdminApi<any[]>(
    () => token ? api.get<any[]>('/promos', token) : Promise.resolve([] as any[]),
    [token],
  );

  const handleDeactivate = async (id: string, isActive: boolean) => {
    if (!token) return;
    try {
      if (isActive) {
        await api.post(`/promos/${id}/deactivate`, {}, token);
      }
      toast('success', isActive ? t('promo.deactivated', lang) : t('promo.activated', lang));
      refetch();
    } catch (e: any) {
      toast('error', e.message || 'Error');
    }
  };

  if (loading) return <LoadingSpinner text={t('promo.loading', lang)} />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>{t('promo.title', lang)}</h2>
          <p className="text-sm mt-1" style={{ color: '#454652' }}>{t('promo.subtitle', lang)}</p>
        </div>
        <button
          onClick={() => router.push('/super/promos/new')}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
        >
          + {t('promo.create', lang)}
        </button>
      </div>

      {!promos || promos.length === 0 ? (
        <EmptyState message={t('promo.empty', lang)} />
      ) : (
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ background: 'rgba(238,238,238,0.5)', color: '#767683' }}>
                <tr>
                  <th className="px-8 py-5">{t('promo.code', lang)}</th>
                  <th className="px-6 py-5">{t('promo.discount', lang)}</th>
                  <th className="px-6 py-5">{t('promo.type', lang)}</th>
                  <th className="px-6 py-5">{t('promo.uses', lang)}</th>
                  <th className="px-6 py-5">{t('promo.expires', lang)}</th>
                  <th className="px-6 py-5">{t('promo.status', lang)}</th>
                  <th className="px-8 py-5 text-right">{t('promo.actions', lang)}</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
                {promos.map((p: any) => (
                  <tr key={p.id} className="hover:opacity-80 transition-opacity">
                    <td className="px-8 py-5 font-bold" style={{ color: '#1a1c1c' }}>{p.code}</td>
                    <td className="px-6 py-5">
                      <span className="font-bold" style={{ color: p.discountType === 'percentage' ? '#059669' : '#000666' }}>
                        {p.discountType === 'percentage' ? `${p.discountValue}%` : `$${Number(p.discountValue).toLocaleString()}`}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#454652' }}>
                      {p.discountType === 'percentage' ? t('promo.percentage', lang) : t('promo.fixed', lang)}
                    </td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#454652' }}>{p.currentUses} / {p.maxUses}</td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#454652' }}>
                      {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[11px] font-black uppercase tracking-[0.08em] px-3 py-1.5 rounded-lg ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                        {p.isActive ? t('promo.active', lang) : t('promo.inactive', lang)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDeactivate(p.id, p.isActive)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg hover:opacity-80 transition-opacity ${p.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                      >
                        {p.isActive ? t('promo.deactivate', lang) : t('promo.activate', lang)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
