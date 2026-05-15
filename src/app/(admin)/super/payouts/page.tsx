'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import {
  DollarSign, Clock, Wallet,
  Award, Download, Briefcase,
  Building2, Train
} from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { downloadCSV } from "@/lib/csv";

export default function SuperPayouts() {
  const { token } = useAuth();
  const lang = useLang();
  const [txPage, setTxPage] = useState(1);

  const { data: payouts, loading: payoutsLoading, error: payoutsError, refetch: refetchPayouts } = useAdminApi(
    () => token ? api.get<any[]>('/payouts/pending', token) : Promise.resolve([]),
    [token],
  );

  const { data: summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useAdminApi(
    () => token ? api.get<any>('/financials/summary', token) : Promise.resolve(null),
    [token],
  );

  const { data: revenue, loading: revenueLoading, error: revenueError, refetch: refetchRevenue } = useAdminApi(
    () => token ? api.get<any[]>('/financials/revenue', token) : Promise.resolve([]),
    [token],
  );

  const { data: txnsData, loading: txnsLoading, error: txnsError, refetch: refetchTxns } = useAdminApi(
    () => token ? api.get<any>(`/financials/transactions?page=${txPage}&limit=10`, token).then(r => r || { items: [], total: 0, page: 1, totalPages: 1 }) : Promise.resolve({ items: [], total: 0, page: 1, totalPages: 1 }),
    [token, txPage],
  );

  const txns = txnsData || { items: [], total: 0, page: 1, totalPages: 1 };

  const loading = payoutsLoading || summaryLoading || revenueLoading || txnsLoading;
  const error = payoutsError || summaryError || revenueError || txnsError;

  if (loading) return <LoadingSpinner text="Loading financials..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => { refetchPayouts(); refetchSummary(); refetchRevenue(); refetchTxns(); }} />;

  const pendingTotal = (payouts || []).reduce((s, p) => s + Number(p.totalGross), 0);
  const revenueData = revenue || [];
  const maxChart = revenueData.length > 0 ? Math.max(...revenueData.map((d: any) => d.value)) : 1;

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-headline font-extrabold tracking-tight" style={{ color: '#000666' }}>{t('finance.financial_overview', lang)}</h2>
        <p className="text-sm mt-2 max-w-2xl" style={{ color: '#454652' }}>
          {t('finance.financial_overview_desc', lang)}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#000666]/5 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#000666] p-2 bg-[#e0e0ff] rounded-lg"><Wallet size={18} /></span>
              <span className="text-xs font-bold text-[#9f4200]">{summary?.totalRevenueChange || '+0%'}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('finance.total_network_revenue', lang)}</p>
            <p className="text-2xl font-headline font-extrabold mt-2" style={{ color: '#000666' }}>${(summary?.totalRevenue || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)] flex flex-col justify-between overflow-hidden relative">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#9f4200] p-2 bg-[#ffdbcb] rounded-lg"><Clock size={18} /></span>
              <span className="text-xs font-bold" style={{ color: '#454652' }}>{summary?.pendingPayoutsCount || 0} {t('finance.pending', lang)}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('finance.pending_payouts', lang)}</p>
            <p className="text-2xl font-headline font-extrabold mt-2" style={{ color: '#000666' }}>${(summary?.pendingPayouts || 0).toFixed(0)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)] flex flex-col justify-between overflow-hidden relative">
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#001944] p-2 bg-[#d9e2ff] rounded-lg"><Award size={18} /></span>
              <span className="text-xs font-bold text-[#9f4200]">+{summary?.subscriptionsChange || '0'} new</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('finance.active_subscriptions', lang)}</p>
            <p className="text-2xl font-headline font-extrabold mt-2" style={{ color: '#000666' }}>{summary?.activeSubscriptions || 0}</p>
          </div>
        </div>

        <div className="text-white p-6 rounded-xl shadow-xl flex flex-col justify-between overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white p-2 bg-white/10 rounded-lg"><DollarSign size={18} /></span>
              <span className="text-xs font-bold" style={{ color: '#8690ee' }}>{summary?.platformFeesPeriod || 'FY'}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">{t('finance.platform_fees', lang)}</p>
            <p className="text-2xl font-headline font-extrabold mt-2">${(summary?.platformFees || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Chart + Payout Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('finance.monthly_revenue_trend', lang)}</h3>
              <p className="text-sm" style={{ color: '#454652' }}>{t('finance.revenue_growth_analysis', lang)}</p>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
              <div className="border-t border-[#767683]" />
              <div className="border-t border-[#767683]" />
              <div className="border-t border-[#767683]" />
              <div className="border-t border-[#767683]" />
            </div>
            {revenueData.map((d, i) => (
              <div key={d.label} className="w-full relative group">
                <div
                  className={`${d.value > 0 && i === revenueData.length - 1 ? 'bg-[#9f4200]' : 'bg-[#e0e0ff] hover:bg-[#000666]'} transition-all rounded-t-lg cursor-pointer`}
                  style={{ height: `${(d.value / maxChart) * 100}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap" style={{ background: '#1a1c1c' }}>${d.value}k</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#454652' }}>
            {revenueData.map(d => <span key={d.label}>{d.label}</span>)}
          </div>
        </div>

        {/* Payout Requests */}
        <div className="bg-[#f3f3f3] p-8 rounded-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('finance.payout_requests', lang)}</h3>
            <span className="text-[10px] px-2 py-1 rounded-full font-extrabold uppercase bg-[#9f4200]/10 text-[#9f4200]">{(payouts || []).length} {t('common.pending', lang)}</span>
          </div>
          {(payouts || []).length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: '#454652' }}>{t('finance.no_transactions', lang)}</div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2 flex-1">
              {(payouts || []).map((p) => (
                <div key={p.id} className="p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-tighter" style={{ color: '#454652' }}>{p.ownerId?.slice(0, 8)}</span>
                    <span className="text-sm font-bold" style={{ color: '#000666' }}>${Number(p.totalGross).toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[10px]" style={{ color: '#454652' }}>Period: {p.periodStart?.split('T')[0]} — {p.periodEnd?.split('T')[0]}</p>
                    <button className="text-[10px] font-bold uppercase hover:underline" style={{ color: '#9f4200' }}>{t('common.confirm', lang)} & {t('common.payment', lang)}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="mt-4 w-full py-3 text-xs font-bold rounded-xl transition-colors" style={{ background: '#e2e2e2', color: '#1a1c1c' }}>
            {t('common.view_details', lang)}
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-12 bg-white rounded-2xl overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
        <div className="p-8 border-b border-[#f3f3f3]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('finance.recent_transactions', lang)}</h3>
              <p className="text-sm" style={{ color: '#454652' }}>{t('finance.transactions_desc', lang)}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => downloadCSV(txns.items.map((t: any) => ({
                  'Transaction ID': t.transactionId,
                  Store: t.store,
                  Amount: t.amount,
                  Fee: t.fee,
                  Status: t.status,
                  Date: new Date(t.date).toLocaleDateString(),
                })), 'transactions')} className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors" style={{ background: '#f3f3f3', color: '#1a1c1c' }}>
                <Download size={14} />
                {t('common.export_csv', lang)}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase font-extrabold tracking-widest" style={{ background: '#f3f3f3', color: '#454652' }}>
              <tr>
                <th className="px-8 py-4">{t('common.transaction', lang)}</th>
                <th className="px-8 py-4">{t('common.store', lang)}</th>
                <th className="px-8 py-4">{t('common.amount', lang)}</th>
                <th className="px-8 py-4">{t('common.fee', lang)}</th>
                <th className="px-8 py-4">{t('common.status', lang)}</th>
                <th className="px-8 py-4">{t('common.date', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {txns.items.map((t: any) => {
                const statusClass = t.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                  t.status === 'pending' ? 'bg-[#ffdbcb] text-[#7a3000]' :
                  t.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-[#d9e2ff] text-[#00429c]';
                return (
                <tr key={t.id} className="hover:bg-[#f3f3f3]/30 transition-colors group" style={{ borderColor: '#f3f3f3' }}>
                  <td className="px-8 py-6 text-sm font-mono font-bold" style={{ color: '#000666' }}>{t.transactionId}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#d9e2ff] flex items-center justify-center">
                        <Briefcase size={16} className="text-[#001944]" />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#1a1c1c' }}>{t.store}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold" style={{ color: '#1a1c1c' }}>${Number(t.amount).toFixed(2)}</td>
                  <td className="px-8 py-6 text-sm" style={{ color: '#454652' }}>${Number(t.fee).toFixed(2)}</td>
                  <td className="px-8 py-6">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-8 py-6 text-sm" style={{ color: '#454652' }}>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              )})}
              {txns.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-sm" style={{ color: '#454652' }}>{t('finance.no_transactions', lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 flex items-center justify-between" style={{ background: '#f3f3f3/50' }}>
          <p className="text-xs" style={{ color: '#454652' }}>{t('common.showing', lang)} 1-{txns.items.length} {t('common.of', lang)} {txns.total} {t('common.transaction', lang)}</p>
          <div className="flex gap-2">
            <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txns.page <= 1}
              className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: Math.min(txns.totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setTxPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${p === txns.page ? 'text-white' : 'bg-white shadow-sm hover:bg-[#000666] hover:text-white'} transition-all`}
                style={p === txns.page ? { background: '#000666' } : {}}>{p}</button>
            ))}
            <button onClick={() => setTxPage(p => Math.min(txns.totalPages, p + 1))} disabled={txns.page >= txns.totalPages}
              className="w-8 h-8 flex items-center justify-center rounded text-xs font-bold bg-white shadow-sm hover:bg-[#000666] hover:text-white transition-all disabled:opacity-30">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
