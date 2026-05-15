'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { AlertTriangle, CheckCircle, Clock, XCircle, ArrowUp, ArrowDown } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

const STATUS_CONFIG: Record<string, { label: string; icon: string; bg: string; color: string }> = {
  open: { label: 'Open', icon: 'error_outline', bg: 'bg-red-50', color: 'text-red-700' },
  in_progress: { label: 'In Progress', icon: 'hourglass_top', bg: 'bg-amber-50', color: 'text-amber-700' },
  resolved: { label: 'Resolved', icon: 'check_circle', bg: 'bg-green-50', color: 'text-green-700' },
  closed: { label: 'Closed', icon: 'cancel', bg: 'bg-gray-50', color: 'text-gray-500' },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: '#22c55e' },
  medium: { label: 'Medium', color: '#9f4200' },
  high: { label: 'High', color: '#dc2626' },
  urgent: { label: 'Urgent', color: '#7c3aed' },
};

export default function SuperClaims() {
  const { token } = useAuth();
  const lang = useLang();
  const [page, setPage] = useState(1);

  const { data: claimsData, loading: claimsLoading, error: claimsError, refetch: refetchClaims } = useAdminApi(
    () => token ? api.get<any>(`/claims?page=${page}&limit=15`, token) : Promise.resolve(null),
    [token, page],
  );

  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAdminApi(
    () => token ? api.get<any>('/claims/stats', token) : Promise.resolve(null),
    [token],
  );

  const claims = claimsData?.items || [];
  const totalPages = claimsData?.totalPages || 1;

  const loading = claimsLoading || statsLoading;
  const error = claimsError || statsError;

  if (loading) return <LoadingSpinner text="Loading claims..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => { refetchClaims(); refetchStats(); }} />;

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#1a1c1c' }}>{t('claim.claims', lang)}</h2>
        <p className="font-medium" style={{ color: '#454652' }}>{t('claim.claims_desc', lang)}</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#1a1c1c' }}>{stats.total}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('common.total', lang)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#dc2626' }}>{stats.open}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('claim.open', lang)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#9f4200' }}>{stats.inProgress}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('claim.in_progress', lang)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#22c55e' }}>{stats.resolved}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('common.resolved', lang)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-[0px_4px_12px_rgba(26,35,126,0.03)] text-center">
            <p className="text-2xl font-headline font-extrabold" style={{ color: '#767683' }}>{stats.closed}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#454652' }}>{t('common.closed', lang)}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[11px] font-black uppercase tracking-[0.1em]" style={{ background: 'rgba(238,238,238,0.5)', color: '#767683' }}>
              <tr>
                <th className="px-8 py-5">{t('common.subject', lang)}</th>
                <th className="px-6 py-5">{t('common.name', lang)}</th>
                <th className="px-6 py-5">{t('common.store', lang)}</th>
                <th className="px-6 py-5">{t('common.priority', lang)}</th>
                <th className="px-6 py-5">{t('common.status', lang)}</th>
                <th className="px-6 py-5">{t('common.date', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(198,197,212,0.1)' }}>
              {claims.map((c: any) => {
                const s = STATUS_CONFIG[c.status] || STATUS_CONFIG.open;
                const p = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG.medium;
                return (
                  <tr key={c.id} className="hover:opacity-80 transition-opacity">
                    <td className="px-8 py-5">
                      <p className="font-bold text-sm" style={{ color: '#1a1c1c' }}>{c.subject}</p>
                      {c.description && (
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#454652' }}>{c.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium" style={{ color: '#1a1c1c' }}>{c.user?.name || 'Unknown'}</p>
                      <p className="text-xs" style={{ color: '#454652' }}>{c.user?.email || ''}</p>
                    </td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#454652' }}>{c.location || '—'}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: `${p.color}15`, color: p.color }}>
                        {c.priority === 'urgent' || c.priority === 'high' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                        {p.label}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">{s.icon}</span>
                        <StatusBadge status={c.status} />
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#454652' }}>
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}
              {claims.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-sm" style={{ color: '#454652' }}>{t('claim.no_claims', lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 flex items-center justify-between border-t" style={{ background: 'rgba(238,238,238,0.3)', borderColor: 'rgba(198,197,212,0.1)' }}>
          <p className="text-sm font-medium" style={{ color: '#454652' }}>{t('common.page', lang)} {page} {t('common.of', lang)} {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-30"
              style={{ borderColor: 'rgba(198,197,212,0.3)', color: '#767683' }}>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-30"
              style={{ borderColor: 'rgba(198,197,212,0.3)', color: '#767683' }}>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
