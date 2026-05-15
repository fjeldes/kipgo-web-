'use client';

import { useAuth } from "@/hooks/useAuth";
import { useAdminApi } from "@/hooks/useAdminApi";
import { api } from "@/lib/api";
import { t, useLang } from "@/lib/i18n";
import { DollarSign, TrendingUp, Wallet, Download } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";

export default function OwnerFinancials() {
  const { token } = useAuth();
  const lang = useLang();

  const { data: bookings, loading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useAdminApi(
    () => token ? api.get<any[]>('/bookings/me', token).then(r => r || []) : Promise.resolve([]),
    [token],
  );

  const { data: stores, loading: storesLoading, error: storesError, refetch: refetchStores } = useAdminApi(
    () => token ? api.get<any[]>('/locations/me', token).then(r => r || []) : Promise.resolve([]),
    [token],
  );

  const loading = bookingsLoading || storesLoading;
  const error = bookingsError || storesError;

  if (loading) return <LoadingSpinner text="Loading financials..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => { refetchBookings(); refetchStores(); }} />;

  const completed = (bookings || []).filter(b => b.status === 'completed');
  const active = (bookings || []).filter(b => b.status === 'in_storage' || b.status === 'confirmed');
  const totalRevenue = completed.reduce((s, b) => s + Number(b.totalPrice || 0), 0);
  const pendingRevenue = active.reduce((s, b) => s + Number(b.totalPrice || 0), 0);
  const monthlyRevenue = completed.filter(b => {
    const d = new Date(b.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((s, b) => s + Number(b.totalPrice || 0), 0);

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-4xl font-headline font-extrabold tracking-tight mb-2" style={{ color: '#000666' }}>{t('finance.financial_overview', lang)}</h2>
        <p className="font-medium" style={{ color: '#454652' }}>{t('owner.financial_overview_desc', lang)}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#e0e0ff' }}>
              <DollarSign size={18} style={{ color: '#000666' }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('common.revenue', lang)}</span>
          </div>
          <p className="text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>${totalRevenue.toFixed(0)}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{completed.length} {t('owner.completed_bookings', lang)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#ffdbcb' }}>
              <TrendingUp size={18} style={{ color: '#9f4200' }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('owner.this_month', lang)}</span>
          </div>
          <p className="text-3xl font-headline font-extrabold" style={{ color: '#9f4200' }}>${monthlyRevenue.toFixed(0)}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{t('owner.earned_this_month', lang)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#d9e2ff' }}>
              <Wallet size={18} style={{ color: '#001944' }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('finance.pending_revenue', lang)}</span>
          </div>
          <p className="text-3xl font-headline font-extrabold" style={{ color: '#001944' }}>${pendingRevenue.toFixed(0)}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{active.length} {t('owner.active_bookings_count', lang)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0px_10px_20px_rgba(26,35,126,0.02)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg" style={{ background: '#e0e0ff' }}>
              <Download size={18} style={{ color: '#000666' }} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#454652' }}>{t('common.store', lang)}</span>
          </div>
          <p className="text-3xl font-headline font-extrabold" style={{ color: '#000666' }}>{(stores || []).length}</p>
          <p className="text-xs mt-1" style={{ color: '#454652' }}>{t('owner.locations_count', lang)}</p>
        </div>
      </div>

      {/* Recent revenue chart */}
      <div className="bg-white rounded-2xl p-8 shadow-[0px_20px_40px_rgba(26,35,126,0.04)] mb-8">
        <h3 className="text-xl font-headline font-bold mb-2" style={{ color: '#000666' }}>{t('finance.revenue_breakdown', lang)}</h3>
        <p className="text-sm mb-6" style={{ color: '#454652' }}>{t('owner.completed_vs_pending', lang)}</p>
        <div className="flex items-end gap-6 h-48">
          <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div className="w-full rounded-t-xl transition-all" style={{ height: `${Math.min((totalRevenue / Math.max(totalRevenue || 1, pendingRevenue || 1)) * 80, 80)}%`, background: 'linear-gradient(135deg, #000666, #1a237e)' }} />
            <span className="text-[10px] font-bold uppercase" style={{ color: '#454652' }}>{t('finance.earned', lang)}</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div className="w-full rounded-t-xl transition-all" style={{ height: `${Math.min((pendingRevenue / Math.max(totalRevenue || 1, pendingRevenue || 1)) * 80, 80)}%`, background: '#9f4200' }} />
            <span className="text-[10px] font-bold uppercase" style={{ color: '#454652' }}>{t('finance.pending_revenue', lang)}</span>
          </div>
        </div>
      </div>

      {/* Recent completed bookings */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0px_20px_40px_rgba(26,35,126,0.04)]">
        <div className="p-8 border-b" style={{ borderColor: '#f3f3f3' }}>
          <h3 className="text-xl font-headline font-bold" style={{ color: '#000666' }}>{t('finance.recent_transactions', lang)}</h3>
          <p className="text-sm mt-1" style={{ color: '#454652' }}>{t('owner.your_transactions', lang)}</p>
        </div>
        {completed.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: '#454652' }}>{t('owner.no_completed', lang)}</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase font-extrabold tracking-widest" style={{ background: '#f3f3f3', color: '#454652' }}>
              <tr>
                <th className="px-8 py-4">{t('common.order', lang)}</th>
                <th className="px-8 py-4">{t('common.customer', lang)}</th>
                <th className="px-8 py-4">Items</th>
                <th className="px-8 py-4">{t('common.date', lang)}</th>
                <th className="px-8 py-4 text-right">{t('common.amount', lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#f3f3f3' }}>
              {completed.slice(0, 10).map((b: any) => (
                <tr key={b.id} className="hover:bg-[#f3f3f3]/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-mono font-bold" style={{ color: '#000666' }}>#{b.id?.slice(0, 8).toUpperCase()}</td>
                  <td className="px-8 py-5 text-sm font-medium" style={{ color: '#1a1c1c' }}>{b.user?.profile?.firstName || b.user?.name || 'Guest'}</td>
                  <td className="px-8 py-5 text-sm" style={{ color: '#454652' }}>{b.items ? `${b.items.small || 0}S ${b.items.medium || 0}M ${b.items.large || 0}L` : '—'}</td>
                  <td className="px-8 py-5 text-sm" style={{ color: '#454652' }}>{b.startDate ? new Date(b.startDate).toLocaleDateString() : '—'}</td>
                  <td className="px-8 py-5 text-right font-bold" style={{ color: '#000666' }}>${Number(b.totalPrice).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}
